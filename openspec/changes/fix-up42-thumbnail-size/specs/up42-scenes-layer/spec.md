## MODIFIED Requirements

### Requirement: Browser source
The source MUST read the status, send the search and get a thumbnail through the same-origin routes of the provider. It MUST read at most 8 MiB of a search answer and at most 4 MiB of a thumbnail.
Origin: spec-first

#### Scenario: Read the status route `up42-scenes-layer-012`
- **WHEN** a test calls `getStatus` with a fake fetch function
- **THEN** the fake fetch function gets one `GET` request for "/api/up42/status" with the signal of the call
- **AND** the body `{"configured":true}` gives `{ok:true, configured:true}`, and `{"configured":false}` gives `{ok:true, configured:false}`
- **AND** another body, an HTTP status that is not `2xx` and a rejection give `{ok:false}`

#### Scenario: Post the search `up42-scenes-layer-013`
- **WHEN** a test calls `searchScenes` with the box [9.568326, 59.784163, 10.431674, 60.215837], `start` "2026-07-22" and `end` "2026-10-21"
- **THEN** the fake fetch function gets one `POST` request for "/api/up42/scenes" with a signal that the source makes
- **AND** the only header is `Content-Type` "application/json"
- **AND** the body is the text `{"box":[9.568326,59.784163,10.431674,60.215837],"start":"2026-07-22","end":"2026-10-21"}`
- **AND** a good answer gives `{ok:true, answer}`, where `answer` is the result of `normalizeAnswer`
- **AND** a source that gets no fetch function uses the fetch function of the page

#### Scenario: Report a search that fails `up42-scenes-layer-014`
- **WHEN** the answer has an HTTP status that is not `2xx` and a JSON body with the fields `error`, `retryAfter`, `used` and `limit`
- **THEN** `searchScenes` gives `{ok:false, status, error}`, with `retryAfter`, `used` and `limit` when each is a whole number of 0 or more
- **AND** a JSON body without a text `error` gives the error "unknown"
- **AND** a body that is not JSON gives the error "bad_answer" with the HTTP status of the answer
- **AND** the source reads a body of 8388608 bytes, and a body of 8388609 bytes gives the error "bad_answer"
- **AND** a rejection gives the status 0 and the error "unreachable"
- **AND** the source aborts a call that does not end in 60 seconds, and the call gives the status 0 and the error "unreachable"
- **AND** the source clears the timer of that call when the call ends
- **AND** the source aborts the signal that it makes when the signal of the call aborts, and when the 60 seconds end
- **AND** the call removes its listener from the signal of the call when the call ends
- **AND** each case above that gives `ok` false sends exactly one request to the fake fetch function, also after the test runs each timer
- **AND** a call rejects with the `AbortError` when the signal of the call aborts

#### Scenario: Get a thumbnail `up42-scenes-layer-015`
- **WHEN** a test calls `getThumbnail` with the id "scene-1"
- **THEN** the fake fetch function gets one `GET` request for "/api/up42/thumbnail/scene-1" with a signal that the source makes, and with no other option
- **AND** a `2xx` answer with the media type "image/png", "image/jpeg" or "image/webp" gives `{ok:true, blob}`
- **AND** `blob` holds the bytes of the body and has the `type` of that media type
- **AND** the media type is the text of `Content-Type` before the first ";", with no white space at the start or the end, in lowercase
- **AND** the header "IMAGE/PNG; charset=binary" gives the `type` "image/png"
- **AND** a `2xx` answer with another media type or with no `Content-Type` gives `{ok:false, status, error:'bad_answer'}`
- **AND** the source reads a body of 4194304 bytes, and a body of 4194305 bytes gives the error "bad_answer"
- **AND** an answer with an HTTP status that is not `2xx` gives `{ok:false, status, error}`, where `error` is the text `error` of its JSON body
- **AND** such an answer gives the error "unknown" for a JSON body without a text `error`, and "bad_answer" for a body that is not JSON
- **AND** a rejection gives the status 0 and the error "unreachable"
- **AND** the source aborts a call that does not end in 20 seconds, and the call gives the status 0 and the error "unreachable"
- **AND** the source clears the timer of that call when the call ends, and the call removes its listener from the signal of the call
- **AND** a call rejects with the `AbortError` when the signal of the call aborts
