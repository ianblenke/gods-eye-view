## ADDED Requirements

### Requirement: Listener image
The folder `docker/reticulum/` MUST hold a Dockerfile that builds the listener from the image "python:3.13-slim". The Dockerfile MUST install the packages `rns` and `lxmf` with pip at the versions 1.5.7 and 1.2.0. The image MUST run as a user that is not root.
Origin: spec-first

#### Scenario: Install Reticulum and LXMF with pip at fixed versions `reticulum-listener-001`
- **WHEN** a test reads `docker/reticulum/Dockerfile`
- **THEN** the base image is "python:3.13-slim"
- **AND** one `pip install` line names "rns==1.5.7" and "lxmf==1.2.0"
- **AND** the Dockerfile copies only the files `listener.py` and `config`

#### Scenario: Run as a user without privileges `reticulum-listener-002`
- **WHEN** a test reads the Dockerfile
- **THEN** the Dockerfile sets `USER` to the number 10001
- **AND** it declares `EXPOSE 8081`
- **AND** it has a `HEALTHCHECK` that reads "http://127.0.0.1:8081/interfaces.json"
- **AND** the `ENTRYPOINT` runs `python` with the file `/opt/reticulum/listener.py`
- **AND** the line "RUN mkdir -p /data && chown 10001:10001 /data" comes before the line `USER`

### Requirement: Listener program
The program `docker/reticulum/listener.py` MUST run Reticulum and the HTTP server in one process. It MUST answer a GET request for `/interfaces.json` with the list of discovered interfaces. It MUST send only twelve fields of each interface. It MUST send each byte value as lower case hexadecimal text.
Origin: spec-first

#### Scenario: Serve one route `reticulum-listener-003`
- **WHEN** a test reads `docker/reticulum/listener.py`
- **THEN** the handler class defines the method `do_GET` and no other method with the prefix `do_`
- **AND** the program compares the path with "/interfaces.json" and answers every other path with the status 404
- **AND** the response has the header `Cache-Control` with the value "no-store"

#### Scenario: Send only twelve fields `reticulum-listener-004`
- **WHEN** a test reads the program
- **THEN** the list `FIELDS` holds exactly `discovery_hash`, `type`, `name`, `last_heard`, `hops`, `latitude`, `longitude`, `height`, `frequency`, `bandwidth`, `sf` and `cr`
- **AND** no line of code outside a comment holds the name of a dropped field in quotation marks
- **AND** the function `public_list` builds each item with `for name in FIELDS`, `record.get(name)` and `item[name] = value`
- **AND** the route sends "json.dumps(public_list())"
- **AND** the dropped names are `config_entry`, `reachable_on`, `port`, `ifac_netname`, `ifac_netkey`, `operator_lxmf_address`, `transport_id`, `network_id`, `stamp`, `value`, `impl_name` and `version`

#### Scenario: Send byte values as hexadecimal text `reticulum-listener-005`
- **WHEN** a test reads the program
- **THEN** the program calls `RNS.hexrep(value, delimit=False)` for a value of the type `bytes`

#### Scenario: Use one process `reticulum-listener-006`
- **WHEN** a test reads the program
- **THEN** the program creates `RNS.Reticulum(configdir=CONFIG_DIR)` and the server `ThreadingHTTPServer` in the same file
- **AND** it reads the list with `RNS.Reticulum.discovered_interfaces()`
- **AND** the server binds to "0.0.0.0" and the port 8081

### Requirement: Listener config
The default config `docker/reticulum/config` MUST make a node that only listens. The node MUST NOT publish itself and MUST NOT run as a transport node. The config MUST connect to the bootstrap hosts as a client.
Origin: spec-first

#### Scenario: Listen and publish nothing `reticulum-listener-007`
- **WHEN** a test reads the default config
- **THEN** the config has the lines "enable_transport = no", "share_instance = no" and "discover_interfaces = yes"
- **AND** the config has none of the words `discoverable`, `listen_on`, `AutoInterface`, `TCPServerInterface` and `autoconnect_discovered_interfaces`

#### Scenario: Connect to the bootstrap hosts as a client `reticulum-listener-008`
- **WHEN** a test reads the default config
- **THEN** the config has between 1 and 10 interface sections
- **AND** each section has the type `BackboneInterface` or `TCPClientInterface`, and the line "enabled = yes"

#### Scenario: Keep an edited config in the volume `reticulum-listener-009`
- **WHEN** a test reads the program
- **THEN** the program copies the default config to `CONFIG_DIR` only when the file `config` does not exist there
- **AND** the default config is at "/opt/reticulum/config" and `CONFIG_DIR` is "/data/rns"

### Requirement: Listener service
The file `compose.reticulum.yaml` MUST add the service `reticulum`. The service MUST have a read-only root file system, no Linux capability and no new privileges. It MUST have a memory limit, a limit of processes and an init process. It MUST have one volume and no published port.
Origin: spec-first

#### Scenario: Limit the listener service `reticulum-listener-010`
- **WHEN** a test reads `compose.reticulum.yaml`
- **THEN** the service `reticulum` builds from "./docker/reticulum" and has `restart` with the value "unless-stopped"
- **AND** it has `read_only` true, `cap_drop` with the value ALL, and `security_opt` with the value "no-new-privileges:true"
- **AND** it has `init` true, `mem_limit` "512m" and `pids_limit` 256
- **AND** its only volume is "gev-reticulum:/data" and it has no `ports`
- **AND** it has no `cap_add`, no `privileged` and no `user`

### Requirement: Listener networks
The service `reticulum` MUST be on a network of its own, with a fixed IPv4 address. The service MUST also be on the default network, with the alias "reticulum.local". The file MUST NOT set `networks` or `network_mode` for the app service.
Origin: spec-first

#### Scenario: Give the listener a fixed address `reticulum-listener-011`
- **WHEN** a test reads `compose.reticulum.yaml`
- **THEN** the service `reticulum` is on the network `reticulum` with `ipv4_address` "${GEV_RETICULUM_ADDRESS:-10.213.77.10}"
- **AND** the network `reticulum` has the subnet "${GEV_RETICULUM_SUBNET:-10.213.77.0/24}", and the address 10.213.77.10 is inside that subnet
- **AND** the service is also on the network `default` with the alias "reticulum.local"

#### Scenario: Tell the app where the listener is `reticulum-listener-012`
- **WHEN** a test reads `compose.reticulum.yaml`
- **THEN** the service `gods-eye-view` has `RETICULUM_LISTENER` with the value "${GEV_RETICULUM_LISTENER:-reticulum.local:8081}"
- **AND** the service `gods-eye-view` has no `networks` and no `network_mode`
- **AND** the shared address rule accepts "reticulum.local:8081" and "10.213.77.10:8081"
- **AND** the URL that `tapUrl` builds for each of the two addresses has the same host as the address
- **AND** the shared address rule refuses "reticulum:8081"

### Requirement: Makefile targets
The Makefile MUST have the target `up-reticulum` for the default network and the target `up-codex-reticulum` for the host network. It MUST have the target `down-reticulum` that stops both containers. The targets `up` and `up-codex` MUST stay as they are.
Origin: spec-first

#### Scenario: Start the app with the listener `reticulum-listener-013`
- **WHEN** a test reads the Makefile
- **THEN** the target `up-reticulum` runs "docker compose -f compose.yaml -f compose.reticulum.yaml build" and then "docker compose -f compose.yaml -f compose.reticulum.yaml up --force-recreate"
- **AND** the target `up-codex-reticulum` runs the same two commands with the three files `compose.yaml`, `compose.codex.yaml` and `compose.reticulum.yaml`
- **AND** the second command of that target starts with "GEV_RETICULUM_LISTENER=$${GEV_RETICULUM_LISTENER:-10.213.77.10:8081}"
- **AND** the target `down-reticulum` runs "docker compose -f compose.yaml -f compose.reticulum.yaml down" and no other command
- **AND** the list `.PHONY` names the three targets

### Requirement: Listener document
The file `docs/fork/reticulum-docker.md` MUST tell the owner how to start and stop the listener. The document MUST state that the node connects out to public nodes whose operators see the IP address.
Origin: spec-first

#### Scenario: Document the start, the stop and the egress `reticulum-listener-014`
- **WHEN** a test reads `docs/fork/reticulum-docker.md`
- **THEN** the document names the commands `make up-reticulum`, `make up-codex-reticulum` and `make down-reticulum`
- **AND** it says that the operators of the public nodes see your IP address
- **AND** it names the volume `gev-reticulum` and the file `/data/rns/config`
