# Director operand audit

Base commit: `290b5d2`.

OPEN means that the proof is not complete.
SHA means Secure Hash Algorithm.
MIME means Multipurpose Internet Mail Extensions.
HTTPS means Hypertext Transfer Protocol Secure.

The table lists each operand and each helper argument.
Each tested row cites a completed mutation and its failed repository test.
An open row lists candidate mutations only.
The candidate list does not give a proof.

| Row | File | Line | Kind | Class | Test and mutation |
| --- | --- | ---: | --- | --- | --- |
| a0001 | src/director/packs/manifest.js | 10 | call | OPEN | No proof |
| a0002 | src/director/packs/manifest.js | 10 | argument freeze 1 | OPEN | No proof |
| a0003 | src/director/packs/manifest.js | 11 | initial field value | OPEN | No proof |
| a0004 | src/director/packs/manifest.js | 14 | initial field value | OPEN | No proof |
| a0005 | src/director/packs/manifest.js | 15 | initial field value | OPEN | No proof |
| a0006 | src/director/packs/manifest.js | 19 | default | OPEN | No proof |
| a0007 | src/director/packs/manifest.js | 20 | call | TESTED | m289,m320,m366 |
| a0008 | src/director/packs/manifest.js | 20 | argument string 1 | OPEN | No proof |
| a0009 | src/director/packs/manifest.js | 20 | argument string 2 | OPEN | No proof |
| a0010 | src/director/packs/manifest.js | 20 | argument string 3 | TESTED | m289,m320,m366 |
| a0011 | src/director/packs/manifest.js | 22 | call | TESTED | m001,m002,m321,m374,m375 |
| a0012 | src/director/packs/manifest.js | 24 | argument every 1 | TESTED | m001,m002,m321,m374,m375 |
| a0013 | src/director/packs/manifest.js | 22 | call | OPEN | No proof |
| a0014 | src/director/packs/manifest.js | 23 | argument split 1 | OPEN | No proof |
| a0015 | src/director/packs/manifest.js | 24 | call | TESTED | m001,m374,m375 |
| a0016 | src/director/packs/manifest.js | 24 | argument test 1 | OPEN | No proof |
| a0017 | src/director/packs/manifest.js | 24 | regex | TESTED | m001,m374,m375 |
| a0018 | src/director/packs/manifest.js | 24 | regex part | TESTED | m001,m374,m375 |
| a0019 | src/director/packs/manifest.js | 24 | regex part | TESTED | m001,m374,m375 |
| a0020 | src/director/packs/manifest.js | 24 | regex part | TESTED | m001,m374,m375 |
| a0021 | src/director/packs/manifest.js | 24 | regex part | TESTED | m001,m374,m375 |
| a0022 | src/director/packs/manifest.js | 26 | call | OPEN | No proof |
| a0023 | src/director/packs/manifest.js | 27 | argument fail 1 | OPEN | No proof |
| a0024 | src/director/packs/manifest.js | 28 | argument fail 2 | OPEN | No proof |
| a0025 | src/director/packs/manifest.js | 34 | call | TESTED | m215,m216,m217,m218,m219,m220,m221,m222 |
| a0026 | src/director/packs/manifest.js | 34 | argument fields 1 | OPEN | No proof |
| a0027 | src/director/packs/manifest.js | 34 | argument fields 2 | OPEN | No proof |
| a0028 | src/director/packs/manifest.js | 34 | argument fields 3 | TESTED | m215,m216,m217,m218,m219,m220,m221,m222 |
| a0029 | src/director/packs/manifest.js | 44 | call | TESTED | m359,m360 |
| a0030 | src/director/packs/manifest.js | 44 | argument string 1 | OPEN | No proof |
| a0031 | src/director/packs/manifest.js | 44 | argument string 2 | TESTED | m359,m360 |
| a0032 | src/director/packs/manifest.js | 45 | comparison | TESTED | m003 |
| a0033 | src/director/packs/manifest.js | 45 | call | OPEN | No proof |
| a0034 | src/director/packs/manifest.js | 45 | argument fail 1 | OPEN | No proof |
| a0035 | src/director/packs/manifest.js | 45 | argument fail 2 | OPEN | No proof |
| a0036 | src/director/packs/manifest.js | 46 | call | OPEN | No proof |
| a0037 | src/director/packs/manifest.js | 46 | argument includes 1 | OPEN | No proof |
| a0038 | src/director/packs/manifest.js | 47 | call | OPEN | No proof |
| a0039 | src/director/packs/manifest.js | 47 | argument fail 1 | OPEN | No proof |
| a0040 | src/director/packs/manifest.js | 47 | argument fail 2 | OPEN | No proof |
| a0041 | src/director/packs/manifest.js | 48 | call | TESTED | m223,m224 |
| a0042 | src/director/packs/manifest.js | 48 | argument fields 1 | OPEN | No proof |
| a0043 | src/director/packs/manifest.js | 48 | argument fields 2 | OPEN | No proof |
| a0044 | src/director/packs/manifest.js | 48 | argument fields 3 | TESTED | m223,m224 |
| a0045 | src/director/packs/manifest.js | 49 | call | TESTED | m361,m362 |
| a0046 | src/director/packs/manifest.js | 49 | argument string 1 | OPEN | No proof |
| a0047 | src/director/packs/manifest.js | 49 | argument string 2 | TESTED | m361,m362 |
| a0048 | src/director/packs/manifest.js | 50 | call | OPEN | No proof |
| a0049 | src/director/packs/manifest.js | 50 | argument validateAssetPath 1 | OPEN | No proof |
| a0050 | src/director/packs/manifest.js | 50 | argument validateAssetPath 2 | OPEN | No proof |
| a0051 | src/director/packs/manifest.js | 51 | call | TESTED | m225,m226,m227 |
| a0052 | src/director/packs/manifest.js | 51 | argument fields 1 | OPEN | No proof |
| a0053 | src/director/packs/manifest.js | 51 | argument fields 2 | OPEN | No proof |
| a0054 | src/director/packs/manifest.js | 51 | argument fields 3 | TESTED | m225,m226,m227 |
| a0055 | src/director/packs/manifest.js | 52 | call | TESTED | m012,m317,m363 |
| a0056 | src/director/packs/manifest.js | 52 | argument string 1 | OPEN | No proof |
| a0057 | src/director/packs/manifest.js | 52 | argument string 2 | OPEN | No proof |
| a0058 | src/director/packs/manifest.js | 52 | argument string 3 | TESTED | m317,m363 |
| a0059 | src/director/packs/manifest.js | 53 | call | TESTED | m013,m318,m364 |
| a0060 | src/director/packs/manifest.js | 53 | argument string 1 | OPEN | No proof |
| a0061 | src/director/packs/manifest.js | 53 | argument string 2 | OPEN | No proof |
| a0062 | src/director/packs/manifest.js | 53 | argument string 3 | TESTED | m318,m364 |
| a0063 | src/director/packs/manifest.js | 54 | call | TESTED | m005,m006,m007,m008,m009,m010,m011,m319,m365 |
| a0064 | src/director/packs/manifest.js | 54 | argument optional 1 | OPEN | No proof |
| a0065 | src/director/packs/manifest.js | 54 | argument optional 2 | OPEN | No proof |
| a0066 | src/director/packs/manifest.js | 54 | argument optional 3 | OPEN | No proof |
| a0067 | src/director/packs/manifest.js | 54 | argument optional 4 | TESTED | m005,m006,m007,m008,m009,m010,m011,m319,m365 |
| a0068 | src/director/packs/manifest.js | 55 | call | TESTED | m319,m365 |
| a0069 | src/director/packs/manifest.js | 55 | argument string 1 | OPEN | No proof |
| a0070 | src/director/packs/manifest.js | 55 | argument string 2 | OPEN | No proof |
| a0071 | src/director/packs/manifest.js | 55 | argument string 3 | TESTED | m319,m365 |
| a0072 | src/director/packs/manifest.js | 58 | constructor | OPEN | No proof |
| a0073 | src/director/packs/manifest.js | 58 | constructor argument 1 | OPEN | No proof |
| a0074 | src/director/packs/manifest.js | 60 | call | TESTED | m010 |
| a0075 | src/director/packs/manifest.js | 60 | argument fail 1 | OPEN | No proof |
| a0076 | src/director/packs/manifest.js | 60 | argument fail 2 | OPEN | No proof |
| a0077 | src/director/packs/manifest.js | 63 | operand || | TESTED | m005,m006,m007,m008,m011 |
| a0078 | src/director/packs/manifest.js | 67 | operand || | TESTED | m009 |
| a0079 | src/director/packs/manifest.js | 63 | operand || | TESTED | m005,m006,m007,m011 |
| a0080 | src/director/packs/manifest.js | 66 | operand || | TESTED | m008 |
| a0081 | src/director/packs/manifest.js | 63 | operand || | TESTED | m005,m006,m011 |
| a0082 | src/director/packs/manifest.js | 65 | operand || | TESTED | m007 |
| a0083 | src/director/packs/manifest.js | 63 | operand || | TESTED | m005,m011 |
| a0084 | src/director/packs/manifest.js | 64 | operand || | TESTED | m006 |
| a0085 | src/director/packs/manifest.js | 63 | comparison | TESTED | m005,m011 |
| a0086 | src/director/packs/manifest.js | 69 | call | OPEN | No proof |
| a0087 | src/director/packs/manifest.js | 70 | argument fail 1 | OPEN | No proof |
| a0088 | src/director/packs/manifest.js | 71 | argument fail 2 | OPEN | No proof |
| a0089 | src/director/packs/manifest.js | 74 | call | TESTED | m014,m017,m376,m399 |
| a0090 | src/director/packs/manifest.js | 74 | argument optional 1 | OPEN | No proof |
| a0091 | src/director/packs/manifest.js | 74 | argument optional 2 | OPEN | No proof |
| a0092 | src/director/packs/manifest.js | 74 | argument optional 3 | OPEN | No proof |
| a0093 | src/director/packs/manifest.js | 74 | argument optional 4 | TESTED | m014,m017,m376,m399 |
| a0094 | src/director/packs/manifest.js | 75 | call | TESTED | m017,m376,m399 |
| a0095 | src/director/packs/manifest.js | 75 | argument number 1 | OPEN | No proof |
| a0096 | src/director/packs/manifest.js | 75 | argument number 2 | OPEN | No proof |
| a0097 | src/director/packs/manifest.js | 75 | argument number 3 | TESTED | m376 |
| a0098 | src/director/packs/manifest.js | 75 | argument number 4 | TESTED | m399 |
| a0099 | src/director/packs/manifest.js | 75 | argument number 5 | OPEN | No proof |
| a0100 | src/director/packs/manifest.js | 76 | call | OPEN | No proof |
| a0101 | src/director/packs/manifest.js | 76 | argument isInteger 1 | OPEN | No proof |
| a0102 | src/director/packs/manifest.js | 76 | call | OPEN | No proof |
| a0103 | src/director/packs/manifest.js | 76 | argument fail 1 | OPEN | No proof |
| a0104 | src/director/packs/manifest.js | 76 | argument fail 2 | OPEN | No proof |
| a0105 | src/director/packs/manifest.js | 78 | call | TESTED | m015,m016,m303,m304,m305,m306,m307 |
| a0106 | src/director/packs/manifest.js | 78 | argument optional 1 | OPEN | No proof |
| a0107 | src/director/packs/manifest.js | 78 | argument optional 2 | OPEN | No proof |
| a0108 | src/director/packs/manifest.js | 78 | argument optional 3 | OPEN | No proof |
| a0109 | src/director/packs/manifest.js | 78 | argument optional 4 | TESTED | m015,m016,m303,m304,m305,m306,m307 |
| a0110 | src/director/packs/manifest.js | 79 | operand || | OPEN | No proof |
| a0111 | src/director/packs/manifest.js | 79 | operand || | TESTED | m303,m304,m305,m306,m307 |
| a0112 | src/director/packs/manifest.js | 79 | comparison | OPEN | No proof |
| a0113 | src/director/packs/manifest.js | 79 | call | TESTED | m303,m304,m305,m306,m307 |
| a0114 | src/director/packs/manifest.js | 79 | argument test 1 | OPEN | No proof |
| a0115 | src/director/packs/manifest.js | 79 | regex | TESTED | m303,m304,m305,m306,m307 |
| a0116 | src/director/packs/manifest.js | 79 | regex part | TESTED | m303,m304,m305,m306,m307 |
| a0117 | src/director/packs/manifest.js | 79 | regex part | TESTED | m303,m304,m305,m306,m307 |
| a0118 | src/director/packs/manifest.js | 79 | regex part | TESTED | m303,m304,m305,m306,m307 |
| a0119 | src/director/packs/manifest.js | 80 | call | OPEN | No proof |
| a0120 | src/director/packs/manifest.js | 80 | argument fail 1 | OPEN | No proof |
| a0121 | src/director/packs/manifest.js | 80 | argument fail 2 | OPEN | No proof |
| a0122 | src/director/packs/manifest.js | 84 | call | TESTED | m155,m156,m157,m158,m159,m238,m239,m264,m265,m266 |
| a0123 | src/director/packs/manifest.js | 85 | argument fields 1 | OPEN | No proof |
| a0124 | src/director/packs/manifest.js | 86 | argument fields 2 | OPEN | No proof |
| a0125 | src/director/packs/manifest.js | 87 | argument fields 3 | TESTED | m155,m156,m157,m158,m159,m238,m239,m264,m265,m266 |
| a0126 | src/director/packs/manifest.js | 87 | ternary condition | TESTED | m238,m265 |
| a0127 | src/director/packs/manifest.js | 88 | ternary value | TESTED | m155,m156,m157 |
| a0128 | src/director/packs/manifest.js | 89 | ternary value | TESTED | m158,m159,m239,m264,m266 |
| a0129 | src/director/packs/manifest.js | 87 | comparison | TESTED | m238,m265 |
| a0130 | src/director/packs/manifest.js | 89 | ternary condition | TESTED | m239,m266 |
| a0131 | src/director/packs/manifest.js | 90 | ternary value | TESTED | m158 |
| a0132 | src/director/packs/manifest.js | 91 | ternary value | TESTED | m159,m264 |
| a0133 | src/director/packs/manifest.js | 89 | comparison | TESTED | m239,m266 |
| a0134 | src/director/packs/manifest.js | 93 | comparison | OPEN | No proof |
| a0135 | src/director/packs/manifest.js | 94 | call | OPEN | No proof |
| a0136 | src/director/packs/manifest.js | 94 | argument has 1 | OPEN | No proof |
| a0137 | src/director/packs/manifest.js | 95 | call | OPEN | No proof |
| a0138 | src/director/packs/manifest.js | 95 | argument fail 1 | OPEN | No proof |
| a0139 | src/director/packs/manifest.js | 95 | argument fail 2 | OPEN | No proof |
| a0140 | src/director/packs/manifest.js | 97 | comparison | TESTED | m021 |
| a0141 | src/director/packs/manifest.js | 98 | call | OPEN | No proof |
| a0142 | src/director/packs/manifest.js | 98 | argument fail 1 | OPEN | No proof |
| a0143 | src/director/packs/manifest.js | 98 | argument fail 2 | OPEN | No proof |
| a0144 | src/director/packs/manifest.js | 99 | comparison | OPEN | No proof |
| a0145 | src/director/packs/manifest.js | 100 | call | TESTED | m377 |
| a0146 | src/director/packs/manifest.js | 100 | argument array 1 | OPEN | No proof |
| a0147 | src/director/packs/manifest.js | 100 | argument array 2 | OPEN | No proof |
| a0148 | src/director/packs/manifest.js | 100 | argument array 3 | OPEN | No proof |
| a0149 | src/director/packs/manifest.js | 101 | comparison | TESTED | m020 |
| a0150 | src/director/packs/manifest.js | 102 | call | OPEN | No proof |
| a0151 | src/director/packs/manifest.js | 102 | argument fail 1 | OPEN | No proof |
| a0152 | src/director/packs/manifest.js | 102 | argument fail 2 | OPEN | No proof |
| a0153 | src/director/packs/manifest.js | 103 | call | TESTED | m160,m161,m162,m163,m164,m165,m166,m167,m267,m268,m269,m270,m310,m311,m312,m313,m315 |
| a0154 | src/director/packs/manifest.js | 103 | argument forEach 1 | TESTED | m160,m161,m162,m163,m164,m165,m166,m167,m267,m268,m269,m270,m310,m311,m312,m313,m315 |
| a0155 | src/director/packs/manifest.js | 104 | call | TESTED | m160,m161,m162,m163,m164,m165,m166,m167,m267,m268,m269,m270,m310,m311,m312,m313,m315 |
| a0156 | src/director/packs/manifest.js | 105 | argument number 1 | OPEN | No proof |
| a0157 | src/director/packs/manifest.js | 106 | argument number 2 | OPEN | No proof |
| a0158 | src/director/packs/manifest.js | 107 | argument number 3 | TESTED | m160,m162,m164,m166,m310,m311 |
| a0159 | src/director/packs/manifest.js | 108 | argument number 4 | TESTED | m161,m163,m165,m167,m267,m268,m269,m270,m312,m313 |
| a0160 | src/director/packs/manifest.js | 109 | argument number 5 | TESTED | m315 |
| a0161 | src/director/packs/manifest.js | 107 | ternary condition | OPEN | No proof |
| a0162 | src/director/packs/manifest.js | 107 | ternary value | TESTED | m310 |
| a0163 | src/director/packs/manifest.js | 107 | ternary value | TESTED | m311 |
| a0164 | src/director/packs/manifest.js | 108 | ternary condition | OPEN | No proof |
| a0165 | src/director/packs/manifest.js | 108 | ternary value | TESTED | m312 |
| a0166 | src/director/packs/manifest.js | 108 | ternary value | TESTED | m313 |
| a0167 | src/director/packs/manifest.js | 112 | operand || | TESTED | m018,m245,m308 |
| a0168 | src/director/packs/manifest.js | 112 | operand || | TESTED | m019,m309 |
| a0169 | src/director/packs/manifest.js | 112 | comparison | TESTED | m018,m245,m308 |
| a0170 | src/director/packs/manifest.js | 112 | comparison | TESTED | m019,m309 |
| a0171 | src/director/packs/manifest.js | 113 | call | OPEN | No proof |
| a0172 | src/director/packs/manifest.js | 113 | argument fail 1 | OPEN | No proof |
| a0173 | src/director/packs/manifest.js | 113 | argument fail 2 | OPEN | No proof |
| a0174 | src/director/packs/manifest.js | 114 | call | TESTED | m168,m316,m400,m401 |
| a0175 | src/director/packs/manifest.js | 114 | argument number 1 | OPEN | No proof |
| a0176 | src/director/packs/manifest.js | 114 | argument number 2 | OPEN | No proof |
| a0177 | src/director/packs/manifest.js | 114 | argument number 3 | TESTED | m400 |
| a0178 | src/director/packs/manifest.js | 114 | argument number 4 | TESTED | m168,m401 |
| a0179 | src/director/packs/manifest.js | 114 | argument number 5 | TESTED | m316 |
| a0180 | src/director/packs/manifest.js | 121 | ternary condition | TESTED | m314 |
| a0181 | src/director/packs/manifest.js | 121 | ternary value | OPEN | No proof |
| a0182 | src/director/packs/manifest.js | 121 | ternary value | OPEN | No proof |
| a0183 | src/director/packs/manifest.js | 121 | call | TESTED | m314 |
| a0184 | src/director/packs/manifest.js | 121 | argument hasOwn 1 | OPEN | No proof |
| a0185 | src/director/packs/manifest.js | 121 | argument hasOwn 2 | OPEN | No proof |
| a0186 | src/director/packs/manifest.js | 122 | call | TESTED | m378,m379 |
| a0187 | src/director/packs/manifest.js | 122 | argument array 1 | OPEN | No proof |
| a0188 | src/director/packs/manifest.js | 122 | argument array 2 | OPEN | No proof |
| a0189 | src/director/packs/manifest.js | 122 | argument array 3 | TESTED | m378,m379 |
| a0190 | src/director/packs/manifest.js | 123 | set | TESTED | m169,m170 |
| a0191 | src/director/packs/manifest.js | 123 | constructor argument 1 | TESTED | m169,m170 |
| a0192 | src/director/packs/manifest.js | 123 | call | TESTED | m169,m170 |
| a0193 | src/director/packs/manifest.js | 123 | argument map 1 | OPEN | No proof |
| a0194 | src/director/packs/manifest.js | 123 | operand || | OPEN | No proof |
| a0195 | src/director/packs/manifest.js | 123 | operand || | OPEN | No proof |
| a0196 | src/director/packs/manifest.js | 124 | set | OPEN | No proof |
| a0197 | src/director/packs/manifest.js | 125 | call | TESTED | m023,m244 |
| a0198 | src/director/packs/manifest.js | 125 | argument forEach 1 | TESTED | m023,m244 |
| a0199 | src/director/packs/manifest.js | 126 | call | OPEN | No proof |
| a0200 | src/director/packs/manifest.js | 126 | argument validateDataPack 1 | OPEN | No proof |
| a0201 | src/director/packs/manifest.js | 126 | argument validateDataPack 2 | OPEN | No proof |
| a0202 | src/director/packs/manifest.js | 126 | argument validateDataPack 3 | OPEN | No proof |
| a0203 | src/director/packs/manifest.js | 127 | call | TESTED | m023,m244 |
| a0204 | src/director/packs/manifest.js | 127 | argument has 1 | OPEN | No proof |
| a0205 | src/director/packs/manifest.js | 128 | call | OPEN | No proof |
| a0206 | src/director/packs/manifest.js | 128 | argument fail 1 | OPEN | No proof |
| a0207 | src/director/packs/manifest.js | 128 | argument fail 2 | OPEN | No proof |
| a0208 | src/director/packs/manifest.js | 129 | call | OPEN | No proof |
| a0209 | src/director/packs/manifest.js | 129 | argument add 1 | OPEN | No proof |
| a0210 | src/director/packs/manifest.js | 131 | call | TESTED | m024,m025 |
| a0211 | src/director/packs/manifest.js | 131 | argument forEach 1 | TESTED | m024,m025 |
| a0212 | src/director/packs/manifest.js | 132 | call | TESTED | m024,m025 |
| a0213 | src/director/packs/manifest.js | 132 | argument optional 1 | OPEN | No proof |
| a0214 | src/director/packs/manifest.js | 132 | argument optional 2 | OPEN | No proof |
| a0215 | src/director/packs/manifest.js | 132 | argument optional 3 | OPEN | No proof |
| a0216 | src/director/packs/manifest.js | 132 | argument optional 4 | TESTED | m024,m025 |
| a0217 | src/director/packs/manifest.js | 133 | call | OPEN | No proof |
| a0218 | src/director/packs/manifest.js | 133 | argument array 1 | OPEN | No proof |
| a0219 | src/director/packs/manifest.js | 133 | argument array 2 | OPEN | No proof |
| a0220 | src/director/packs/manifest.js | 133 | argument array 3 | OPEN | No proof |
| a0221 | src/director/packs/manifest.js | 134 | operand || | TESTED | m024 |
| a0222 | src/director/packs/manifest.js | 134 | operand || | TESTED | m025 |
| a0223 | src/director/packs/manifest.js | 134 | comparison | TESTED | m024 |
| a0224 | src/director/packs/manifest.js | 134 | set | OPEN | No proof |
| a0225 | src/director/packs/manifest.js | 134 | constructor argument 1 | OPEN | No proof |
| a0226 | src/director/packs/manifest.js | 134 | call | TESTED | m025 |
| a0227 | src/director/packs/manifest.js | 134 | argument some 1 | OPEN | No proof |
| a0228 | src/director/packs/manifest.js | 134 | call | OPEN | No proof |
| a0229 | src/director/packs/manifest.js | 134 | argument has 1 | OPEN | No proof |
| a0230 | src/director/packs/manifest.js | 135 | call | OPEN | No proof |
| a0231 | src/director/packs/manifest.js | 135 | argument fail 1 | OPEN | No proof |
| a0232 | src/director/packs/manifest.js | 135 | argument fail 2 | OPEN | No proof |
| a0233 | src/director/packs/geojson.js | 5 | call | TESTED | m333 |
| a0234 | src/director/packs/geojson.js | 6 | argument parse 1 | TESTED | m333 |
| a0235 | src/director/packs/geojson.js | 6 | call | TESTED | m333 |
| a0236 | src/director/packs/geojson.js | 6 | argument decode 1 | OPEN | No proof |
| a0237 | src/director/packs/geojson.js | 6 | constructor | TESTED | m333 |
| a0238 | src/director/packs/geojson.js | 6 | constructor argument 1 | OPEN | No proof |
| a0239 | src/director/packs/geojson.js | 6 | constructor argument 2 | TESTED | m333 |
| a0240 | src/director/packs/geojson.js | 6 | initial field value | OPEN | No proof |
| a0241 | src/director/packs/geojson.js | 9 | operand || | TESTED | m027,m028,m334 |
| a0242 | src/director/packs/geojson.js | 11 | operand || | TESTED | m029,m285 |
| a0243 | src/director/packs/geojson.js | 9 | operand || | TESTED | m027,m334 |
| a0244 | src/director/packs/geojson.js | 10 | operand || | TESTED | m028 |
| a0245 | src/director/packs/geojson.js | 9 | comparison | TESTED | m027,m334 |
| a0246 | src/director/packs/geojson.js | 9 | optional | TESTED | m334 |
| a0247 | src/director/packs/geojson.js | 10 | call | OPEN | No proof |
| a0248 | src/director/packs/geojson.js | 10 | argument isArray 1 | OPEN | No proof |
| a0249 | src/director/packs/geojson.js | 11 | comparison | TESTED | m029,m285 |
| a0250 | src/director/packs/geojson.js | 13 | constructor | OPEN | No proof |
| a0251 | src/director/packs/geojson.js | 13 | constructor argument 1 | OPEN | No proof |
| a0252 | src/director/packs/geojson.js | 14 | initial value | OPEN | No proof |
| a0253 | src/director/packs/geojson.js | 15 | set | OPEN | No proof |
| a0254 | src/director/packs/geojson.js | 18 | operand || | TESTED | m035,m036,m037,m038,m039,m040,m041,m171,m211,m212,m213,m368,m369,m370,m371,m372,m373,m402,m403 |
| a0255 | src/director/packs/geojson.js | 24 | operand || | TESTED | m042,m287 |
| a0256 | src/director/packs/geojson.js | 18 | operand || | TESTED | m035,m036,m037,m038,m039,m171,m211,m212,m213,m368,m369,m370,m371,m372,m373 |
| a0257 | src/director/packs/geojson.js | 23 | operand || | TESTED | m040,m041,m402,m403 |
| a0258 | src/director/packs/geojson.js | 18 | operand || | TESTED | m035,m036,m037,m038,m171,m211,m212,m213,m368,m370,m372,m373 |
| a0259 | src/director/packs/geojson.js | 22 | operand || | TESTED | m039,m369,m371 |
| a0260 | src/director/packs/geojson.js | 18 | operand || | TESTED | m035,m036,m037,m211,m212,m213,m372,m373 |
| a0261 | src/director/packs/geojson.js | 21 | operand || | TESTED | m038,m171,m368,m370 |
| a0262 | src/director/packs/geojson.js | 18 | operand || | TESTED | m035,m036,m372,m373 |
| a0263 | src/director/packs/geojson.js | 20 | operand || | TESTED | m037,m211,m212,m213 |
| a0264 | src/director/packs/geojson.js | 18 | operand || | TESTED | m035 |
| a0265 | src/director/packs/geojson.js | 19 | operand || | TESTED | m036,m372,m373 |
| a0266 | src/director/packs/geojson.js | 18 | call | OPEN | No proof |
| a0267 | src/director/packs/geojson.js | 18 | argument isArray 1 | OPEN | No proof |
| a0268 | src/director/packs/geojson.js | 19 | call | OPEN | No proof |
| a0269 | src/director/packs/geojson.js | 19 | argument includes 1 | OPEN | No proof |
| a0270 | src/director/packs/geojson.js | 20 | call | TESTED | m037,m211,m212,m213 |
| a0271 | src/director/packs/geojson.js | 20 | argument some 1 | TESTED | m211,m212,m213 |
| a0272 | src/director/packs/geojson.js | 20 | call | OPEN | No proof |
| a0273 | src/director/packs/geojson.js | 20 | argument isFinite 1 | OPEN | No proof |
| a0274 | src/director/packs/geojson.js | 21 | comparison | TESTED | m038,m171,m368,m370 |
| a0275 | src/director/packs/geojson.js | 21 | call | TESTED | m368 |
| a0276 | src/director/packs/geojson.js | 21 | argument abs 1 | OPEN | No proof |
| a0277 | src/director/packs/geojson.js | 22 | comparison | TESTED | m039,m369,m371 |
| a0278 | src/director/packs/geojson.js | 22 | call | TESTED | m369 |
| a0279 | src/director/packs/geojson.js | 22 | argument abs 1 | OPEN | No proof |
| a0280 | src/director/packs/geojson.js | 23 | operand && | OPEN | Candidates: m172 |
| a0281 | src/director/packs/geojson.js | 23 | operand && | TESTED | m040,m041,m402,m403 |
| a0282 | src/director/packs/geojson.js | 23 | comparison | known limit | m172; proposal.md |
| a0283 | src/director/packs/geojson.js | 23 | operand || | TESTED | m040,m402 |
| a0284 | src/director/packs/geojson.js | 23 | operand || | TESTED | m041,m403 |
| a0285 | src/director/packs/geojson.js | 23 | comparison | TESTED | m040,m402 |
| a0286 | src/director/packs/geojson.js | 23 | comparison | TESTED | m041,m403 |
| a0287 | src/director/packs/geojson.js | 24 | comparison | TESTED | m042,m287 |
| a0288 | src/director/packs/geojson.js | 26 | constructor | OPEN | No proof |
| a0289 | src/director/packs/geojson.js | 26 | constructor argument 1 | OPEN | No proof |
| a0290 | src/director/packs/geojson.js | 27 | operand ?? | OPEN | No proof |
| a0291 | src/director/packs/geojson.js | 27 | operand ?? | TESTED | m043 |
| a0292 | src/director/packs/geojson.js | 29 | default | OPEN | No proof |
| a0293 | src/director/packs/geojson.js | 30 | operand || | TESTED | m045 |
| a0294 | src/director/packs/geojson.js | 30 | operand || | TESTED | m046,m047 |
| a0295 | src/director/packs/geojson.js | 30 | call | OPEN | No proof |
| a0296 | src/director/packs/geojson.js | 30 | argument isArray 1 | OPEN | No proof |
| a0297 | src/director/packs/geojson.js | 30 | comparison | TESTED | m046,m047 |
| a0298 | src/director/packs/geojson.js | 30 | ternary condition | OPEN | No proof |
| a0299 | src/director/packs/geojson.js | 30 | ternary value | OPEN | No proof |
| a0300 | src/director/packs/geojson.js | 30 | ternary value | OPEN | No proof |
| a0301 | src/director/packs/geojson.js | 31 | constructor | OPEN | No proof |
| a0302 | src/director/packs/geojson.js | 31 | constructor argument 1 | OPEN | No proof |
| a0303 | src/director/packs/geojson.js | 32 | call | OPEN | No proof |
| a0304 | src/director/packs/geojson.js | 32 | argument map 1 | OPEN | No proof |
| a0305 | src/director/packs/geojson.js | 33 | operand && | OPEN | No proof |
| a0306 | src/director/packs/geojson.js | 33 | operand && | TESTED | m049,m050,m051 |
| a0307 | src/director/packs/geojson.js | 33 | call | TESTED | m049,m050,m051 |
| a0308 | src/director/packs/geojson.js | 33 | argument some 1 | TESTED | m049,m050,m051 |
| a0309 | src/director/packs/geojson.js | 33 | comparison | TESTED | m049,m050,m051 |
| a0310 | src/director/packs/geojson.js | 33 | call | OPEN | No proof |
| a0311 | src/director/packs/geojson.js | 33 | argument at 1 | OPEN | No proof |
| a0312 | src/director/packs/geojson.js | 34 | constructor | OPEN | No proof |
| a0313 | src/director/packs/geojson.js | 34 | constructor argument 1 | OPEN | No proof |
| a0314 | src/director/packs/geojson.js | 37 | call | TESTED | m030,m031,m032,m033,m034,m052,m053,m054,m055,m056,m057,m247,m286,m288,m335,m336,m337,m338,m339 |
| a0315 | src/director/packs/geojson.js | 37 | argument map 1 | TESTED | m030,m031,m032,m033,m034,m052,m053,m054,m055,m056,m057,m247,m286,m288,m335,m336,m337,m338,m339 |
| a0316 | src/director/packs/geojson.js | 38 | optional | TESTED | m335 |
| a0317 | src/director/packs/geojson.js | 40 | operand || | TESTED | m030,m031,m032,m033,m286,m336 |
| a0318 | src/director/packs/geojson.js | 44 | operand || | TESTED | m034 |
| a0319 | src/director/packs/geojson.js | 40 | operand || | TESTED | m030,m031,m032,m336 |
| a0320 | src/director/packs/geojson.js | 43 | operand || | TESTED | m033,m286 |
| a0321 | src/director/packs/geojson.js | 40 | operand || | TESTED | m030,m031,m336 |
| a0322 | src/director/packs/geojson.js | 42 | operand || | TESTED | m032 |
| a0323 | src/director/packs/geojson.js | 40 | operand || | TESTED | m030,m336 |
| a0324 | src/director/packs/geojson.js | 41 | operand || | TESTED | m031 |
| a0325 | src/director/packs/geojson.js | 40 | comparison | TESTED | m030,m336 |
| a0326 | src/director/packs/geojson.js | 40 | optional | TESTED | m336 |
| a0327 | src/director/packs/geojson.js | 41 | comparison | TESTED | m031 |
| a0328 | src/director/packs/geojson.js | 42 | call | OPEN | No proof |
| a0329 | src/director/packs/geojson.js | 43 | comparison | TESTED | m033,m286 |
| a0330 | src/director/packs/geojson.js | 44 | call | TESTED | m034 |
| a0331 | src/director/packs/geojson.js | 44 | argument has 1 | OPEN | No proof |
| a0332 | src/director/packs/geojson.js | 46 | constructor | OPEN | No proof |
| a0333 | src/director/packs/geojson.js | 46 | constructor argument 1 | OPEN | No proof |
| a0334 | src/director/packs/geojson.js | 47 | call | OPEN | No proof |
| a0335 | src/director/packs/geojson.js | 47 | argument add 1 | OPEN | No proof |
| a0336 | src/director/packs/geojson.js | 50 | comparison | TESTED | m337 |
| a0337 | src/director/packs/geojson.js | 50 | optional | TESTED | m337 |
| a0338 | src/director/packs/geojson.js | 50 | call | OPEN | No proof |
| a0339 | src/director/packs/geojson.js | 50 | argument position 1 | OPEN | No proof |
| a0340 | src/director/packs/geojson.js | 51 | comparison | TESTED | m338 |
| a0341 | src/director/packs/geojson.js | 51 | optional | TESTED | m338 |
| a0342 | src/director/packs/geojson.js | 51 | call | OPEN | No proof |
| a0343 | src/director/packs/geojson.js | 51 | argument line 1 | OPEN | No proof |
| a0344 | src/director/packs/geojson.js | 53 | operand && | TESTED | m052,m053,m054,m339 |
| a0345 | src/director/packs/geojson.js | 56 | operand && | TESTED | m055,m288 |
| a0346 | src/director/packs/geojson.js | 53 | operand && | TESTED | m052,m053,m339 |
| a0347 | src/director/packs/geojson.js | 55 | operand && | TESTED | m054 |
| a0348 | src/director/packs/geojson.js | 53 | operand && | TESTED | m052,m339 |
| a0349 | src/director/packs/geojson.js | 54 | operand && | TESTED | m053 |
| a0350 | src/director/packs/geojson.js | 53 | comparison | TESTED | m052,m339 |
| a0351 | src/director/packs/geojson.js | 53 | optional | TESTED | m339 |
| a0352 | src/director/packs/geojson.js | 54 | call | TESTED | m053 |
| a0353 | src/director/packs/geojson.js | 54 | argument isArray 1 | OPEN | No proof |
| a0354 | src/director/packs/geojson.js | 56 | comparison | TESTED | m055,m288 |
| a0355 | src/director/packs/geojson.js | 58 | call | TESTED | m056 |
| a0356 | src/director/packs/geojson.js | 58 | argument map 1 | OPEN | No proof |
| a0357 | src/director/packs/geojson.js | 58 | call | OPEN | No proof |
| a0358 | src/director/packs/geojson.js | 58 | argument line 1 | OPEN | No proof |
| a0359 | src/director/packs/geojson.js | 58 | argument line 2 | OPEN | No proof |
| a0360 | src/director/packs/geojson.js | 59 | constructor | OPEN | No proof |
| a0361 | src/director/packs/geojson.js | 59 | constructor argument 1 | OPEN | No proof |
| a0362 | src/director/packs/session.js | 4 | default | OPEN | No proof |
| a0363 | src/director/packs/session.js | 5 | constructor | TESTED | m065,m183,m232,m250,m251,m396,m397,m398 |
| a0364 | src/director/packs/session.js | 5 | constructor argument 1 | TESTED | m065,m183,m232,m250,m251,m396,m397,m398 |
| a0365 | src/director/packs/session.js | 6 | initial value | OPEN | No proof |
| a0366 | src/director/packs/session.js | 10 | call | OPEN | No proof |
| a0367 | src/director/packs/session.js | 10 | argument reject 1 | OPEN | No proof |
| a0368 | src/director/packs/session.js | 13 | call | TESTED | m396 |
| a0369 | src/director/packs/session.js | 13 | argument addEventListener 1 | OPEN | No proof |
| a0370 | src/director/packs/session.js | 13 | argument addEventListener 2 | OPEN | No proof |
| a0371 | src/director/packs/session.js | 13 | argument addEventListener 3 | OPEN | No proof |
| a0372 | src/director/packs/session.js | 13 | initial field value | OPEN | No proof |
| a0373 | src/director/packs/session.js | 14 | call | OPEN | No proof |
| a0374 | src/director/packs/session.js | 15 | call | TESTED | m065,m183,m250,m251,m397,m398 |
| a0375 | src/director/packs/session.js | 16 | argument then 1 | TESTED | m065,m250,m251,m397 |
| a0376 | src/director/packs/session.js | 24 | argument then 2 | TESTED | m183,m398 |
| a0377 | src/director/packs/session.js | 15 | call | OPEN | No proof |
| a0378 | src/director/packs/session.js | 15 | argument resolve 1 | OPEN | No proof |
| a0379 | src/director/packs/session.js | 17 | call | TESTED | m397 |
| a0380 | src/director/packs/session.js | 17 | argument removeEventListener 1 | OPEN | No proof |
| a0381 | src/director/packs/session.js | 17 | argument removeEventListener 2 | OPEN | No proof |
| a0382 | src/director/packs/session.js | 18 | call | TESTED | m065,m250,m251 |
| a0383 | src/director/packs/session.js | 18 | argument late 1 | OPEN | No proof |
| a0384 | src/director/packs/session.js | 21 | call | OPEN | No proof |
| a0385 | src/director/packs/session.js | 21 | argument resolve 1 | OPEN | No proof |
| a0386 | src/director/packs/session.js | 25 | call | TESTED | m398 |
| a0387 | src/director/packs/session.js | 25 | argument removeEventListener 1 | OPEN | No proof |
| a0388 | src/director/packs/session.js | 25 | argument removeEventListener 2 | OPEN | No proof |
| a0389 | src/director/packs/session.js | 28 | call | OPEN | No proof |
| a0390 | src/director/packs/session.js | 28 | argument reject 1 | OPEN | No proof |
| a0391 | src/director/packs/session.js | 36 | default | TESTED | m272 |
| a0392 | src/director/packs/session.js | 37 | default | OPEN | No proof |
| a0393 | src/director/packs/session.js | 38 | default | OPEN | No proof |
| a0394 | src/director/packs/session.js | 39 | default | TESTED | m272 |
| a0395 | src/director/packs/session.js | 41 | constructor | OPEN | No proof |
| a0396 | src/director/packs/session.js | 41 | constructor argument 1 | OPEN | No proof |
| a0397 | src/director/packs/session.js | 41 | call | OPEN | No proof |
| a0398 | src/director/packs/session.js | 41 | argument entries 1 | OPEN | No proof |
| a0399 | src/director/packs/session.js | 42 | constructor | OPEN | No proof |
| a0400 | src/director/packs/session.js | 42 | constructor argument 1 | OPEN | No proof |
| a0401 | src/director/packs/session.js | 42 | call | OPEN | No proof |
| a0402 | src/director/packs/session.js | 42 | argument entries 1 | OPEN | No proof |
| a0403 | src/director/packs/session.js | 43 | initial value | OPEN | No proof |
| a0404 | src/director/packs/session.js | 44 | initial value | OPEN | No proof |
| a0405 | src/director/packs/session.js | 49 | call | OPEN | No proof |
| a0406 | src/director/packs/session.js | 50 | call | OPEN | No proof |
| a0407 | src/director/packs/session.js | 51 | call | TESTED | m329 |
| a0408 | src/director/packs/session.js | 51 | argument clearTimeout 1 | OPEN | No proof |
| a0409 | src/director/packs/session.js | 52 | call | TESTED | m063,m291,m331 |
| a0410 | src/director/packs/session.js | 52 | call | OPEN | No proof |
| a0411 | src/director/packs/session.js | 52 | argument splice 1 | OPEN | No proof |
| a0412 | src/director/packs/session.js | 52 | call | OPEN | No proof |
| a0413 | src/director/packs/session.js | 58 | call | OPEN | No proof |
| a0414 | src/director/packs/session.js | 62 | operand || | OPEN | No proof |
| a0415 | src/director/packs/session.js | 62 | operand || | TESTED | m173 |
| a0416 | src/director/packs/session.js | 62 | optional | OPEN | No proof |
| a0417 | src/director/packs/session.js | 63 | operand || | OPEN | No proof |
| a0418 | src/director/packs/session.js | 63 | operand || | TESTED | m174 |
| a0419 | src/director/packs/session.js | 63 | optional | OPEN | No proof |
| a0420 | src/director/packs/session.js | 63 | optional | OPEN | No proof |
| a0421 | src/director/packs/session.js | 66 | default | OPEN | No proof |
| a0422 | src/director/packs/session.js | 66 | default | OPEN | No proof |
| a0423 | src/director/packs/session.js | 67 | call | OPEN | No proof |
| a0424 | src/director/packs/session.js | 68 | operand || | TESTED | m059 |
| a0425 | src/director/packs/session.js | 68 | operand || | TESTED | m060,m322 |
| a0426 | src/director/packs/session.js | 68 | call | OPEN | No proof |
| a0427 | src/director/packs/session.js | 68 | argument isArray 1 | OPEN | No proof |
| a0428 | src/director/packs/session.js | 68 | comparison | TESTED | m060,m322 |
| a0429 | src/director/packs/session.js | 69 | constructor | OPEN | No proof |
| a0430 | src/director/packs/session.js | 69 | constructor argument 1 | OPEN | No proof |
| a0431 | src/director/packs/session.js | 70 | set | TESTED | m233 |
| a0432 | src/director/packs/session.js | 70 | constructor argument 1 | TESTED | m233 |
| a0433 | src/director/packs/session.js | 70 | call | TESTED | m233 |
| a0434 | src/director/packs/session.js | 70 | argument map 1 | TESTED | m233 |
| a0435 | src/director/packs/session.js | 71 | call | TESTED | m330 |
| a0436 | src/director/packs/session.js | 71 | argument forEach 1 | OPEN | No proof |
| a0437 | src/director/packs/session.js | 72 | call | OPEN | No proof |
| a0438 | src/director/packs/session.js | 72 | argument validateDataPack 1 | OPEN | No proof |
| a0439 | src/director/packs/session.js | 72 | argument validateDataPack 2 | OPEN | No proof |
| a0440 | src/director/packs/session.js | 72 | argument validateDataPack 3 | OPEN | No proof |
| a0441 | src/director/packs/session.js | 74 | operand || | OPEN | No proof |
| a0442 | src/director/packs/session.js | 74 | operand || | OPEN | No proof |
| a0443 | src/director/packs/session.js | 74 | optional | OPEN | No proof |
| a0444 | src/director/packs/session.js | 76 | constructor | OPEN | No proof |
| a0445 | src/director/packs/session.js | 77 | initial value | TESTED | m380 |
| a0446 | src/director/packs/session.js | 79 | initial field value | OPEN | No proof |
| a0447 | src/director/packs/session.js | 80 | initial field value | TESTED | m380 |
| a0448 | src/director/packs/session.js | 81 | optional | OPEN | No proof |
| a0449 | src/director/packs/session.js | 81 | call | OPEN | No proof |
| a0450 | src/director/packs/session.js | 81 | argument removeEventListener 1 | OPEN | No proof |
| a0451 | src/director/packs/session.js | 81 | argument removeEventListener 2 | OPEN | No proof |
| a0452 | src/director/packs/session.js | 81 | optional | OPEN | No proof |
| a0453 | src/director/packs/session.js | 84 | comparison | OPEN | No proof |
| a0454 | src/director/packs/session.js | 84 | call | OPEN | No proof |
| a0455 | src/director/packs/session.js | 87 | optional | OPEN | No proof |
| a0456 | src/director/packs/session.js | 87 | call | OPEN | No proof |
| a0457 | src/director/packs/session.js | 87 | argument addEventListener 1 | OPEN | No proof |
| a0458 | src/director/packs/session.js | 87 | argument addEventListener 2 | OPEN | No proof |
| a0459 | src/director/packs/session.js | 87 | argument addEventListener 3 | OPEN | No proof |
| a0460 | src/director/packs/session.js | 87 | optional | OPEN | No proof |
| a0461 | src/director/packs/session.js | 87 | initial field value | OPEN | No proof |
| a0462 | src/director/packs/session.js | 88 | call | TESTED | m271 |
| a0463 | src/director/packs/session.js | 89 | argument setTimeout 1 | OPEN | No proof |
| a0464 | src/director/packs/session.js | 90 | argument setTimeout 2 | TESTED | m271 |
| a0465 | src/director/packs/session.js | 89 | call | OPEN | No proof |
| a0466 | src/director/packs/session.js | 89 | argument abort 1 | OPEN | No proof |
| a0467 | src/director/packs/session.js | 89 | constructor | OPEN | No proof |
| a0468 | src/director/packs/session.js | 89 | constructor argument 1 | OPEN | No proof |
| a0469 | src/director/packs/session.js | 92 | initial value | OPEN | No proof |
| a0470 | src/director/packs/session.js | 95 | call | OPEN | No proof |
| a0471 | src/director/packs/session.js | 95 | argument get 1 | OPEN | No proof |
| a0472 | src/director/packs/session.js | 96 | call | TESTED | m240,m241,m242 |
| a0473 | src/director/packs/session.js | 96 | argument get 1 | OPEN | No proof |
| a0474 | src/director/packs/session.js | 97 | operand || | TESTED | m071 |
| a0475 | src/director/packs/session.js | 97 | operand || | TESTED | m072,m201 |
| a0476 | src/director/packs/session.js | 98 | constructor | OPEN | No proof |
| a0477 | src/director/packs/session.js | 98 | constructor argument 1 | OPEN | No proof |
| a0478 | src/director/packs/session.js | 99 | call | TESTED | m079,m176,m325 |
| a0479 | src/director/packs/session.js | 100 | argument untilAbort 1 | TESTED | m079,m176,m325 |
| a0480 | src/director/packs/session.js | 105 | argument untilAbort 2 | OPEN | No proof |
| a0481 | src/director/packs/session.js | 100 | call | TESTED | m079,m176,m325 |
| a0482 | src/director/packs/session.js | 100 | argument source 1 | TESTED | m079,m176,m325 |
| a0483 | src/director/packs/session.js | 103 | operand || | OPEN | No proof |
| a0484 | src/director/packs/session.js | 103 | operand || | TESTED | m176 |
| a0485 | src/director/packs/session.js | 107 | call | OPEN | No proof |
| a0486 | src/director/packs/session.js | 110 | operand || | TESTED | m073,m074,m075,m323 |
| a0487 | src/director/packs/session.js | 113 | operand || | TESTED | m076,m177 |
| a0488 | src/director/packs/session.js | 110 | operand || | TESTED | m073,m074 |
| a0489 | src/director/packs/session.js | 112 | operand || | TESTED | m075,m323 |
| a0490 | src/director/packs/session.js | 110 | operand || | TESTED | m073 |
| a0491 | src/director/packs/session.js | 111 | operand || | TESTED | m074 |
| a0492 | src/director/packs/session.js | 112 | comparison | TESTED | m075,m323 |
| a0493 | src/director/packs/session.js | 113 | operand && | OPEN | No proof |
| a0494 | src/director/packs/session.js | 113 | operand && | OPEN | No proof |
| a0495 | src/director/packs/session.js | 113 | comparison | OPEN | No proof |
| a0496 | src/director/packs/session.js | 115 | constructor | OPEN | No proof |
| a0497 | src/director/packs/session.js | 115 | constructor argument 1 | OPEN | No proof |
| a0498 | src/director/packs/session.js | 117 | comparison | TESTED | m077,m324 |
| a0499 | src/director/packs/session.js | 118 | constructor | OPEN | No proof |
| a0500 | src/director/packs/session.js | 118 | constructor argument 1 | OPEN | No proof |
| a0501 | src/director/packs/session.js | 120 | call | OPEN | No proof |
| a0502 | src/director/packs/session.js | 121 | argument untilAbort 1 | OPEN | No proof |
| a0503 | src/director/packs/session.js | 122 | argument untilAbort 2 | OPEN | No proof |
| a0504 | src/director/packs/session.js | 121 | call | OPEN | No proof |
| a0505 | src/director/packs/session.js | 121 | argument digest 1 | OPEN | No proof |
| a0506 | src/director/packs/session.js | 121 | argument digest 2 | OPEN | No proof |
| a0507 | src/director/packs/session.js | 124 | call | OPEN | No proof |
| a0508 | src/director/packs/session.js | 126 | argument join 1 | OPEN | No proof |
| a0509 | src/director/packs/session.js | 124 | call | OPEN | No proof |
| a0510 | src/director/packs/session.js | 124 | argument from 1 | OPEN | No proof |
| a0511 | src/director/packs/session.js | 124 | argument from 2 | OPEN | No proof |
| a0512 | src/director/packs/session.js | 124 | constructor | OPEN | No proof |
| a0513 | src/director/packs/session.js | 124 | constructor argument 1 | OPEN | No proof |
| a0514 | src/director/packs/session.js | 125 | call | OPEN | No proof |
| a0515 | src/director/packs/session.js | 125 | argument padStart 1 | OPEN | No proof |
| a0516 | src/director/packs/session.js | 125 | argument padStart 2 | OPEN | No proof |
| a0517 | src/director/packs/session.js | 125 | call | OPEN | No proof |
| a0518 | src/director/packs/session.js | 125 | argument toString 1 | OPEN | No proof |
| a0519 | src/director/packs/session.js | 127 | comparison | TESTED | m078,m253 |
| a0520 | src/director/packs/session.js | 128 | constructor | OPEN | No proof |
| a0521 | src/director/packs/session.js | 128 | constructor argument 1 | OPEN | No proof |
| a0522 | src/director/packs/session.js | 130 | call | TESTED | m066,m326,m327,m394,m395 |
| a0523 | src/director/packs/session.js | 131 | argument untilAbort 1 | TESTED | m326,m327,m394,m395 |
| a0524 | src/director/packs/session.js | 132 | argument untilAbort 2 | OPEN | No proof |
| a0525 | src/director/packs/session.js | 133 | argument untilAbort 3 | TESTED | m066 |
| a0526 | src/director/packs/session.js | 131 | call | TESTED | m326,m327,m394,m395 |
| a0527 | src/director/packs/session.js | 131 | argument adapter 1 | TESTED | m326,m327,m394,m395 |
| a0528 | src/director/packs/session.js | 133 | optional | TESTED | m066 |
| a0529 | src/director/packs/session.js | 133 | call | TESTED | m066 |
| a0530 | src/director/packs/session.js | 133 | optional | TESTED | m066 |
| a0531 | src/director/packs/session.js | 135 | operand || | TESTED | m080,m283 |
| a0532 | src/director/packs/session.js | 135 | operand || | TESTED | m081 |
| a0533 | src/director/packs/session.js | 135 | comparison | TESTED | m081 |
| a0534 | src/director/packs/session.js | 136 | constructor | OPEN | No proof |
| a0535 | src/director/packs/session.js | 136 | constructor argument 1 | OPEN | No proof |
| a0536 | src/director/packs/session.js | 137 | operand || | OPEN | No proof |
| a0537 | src/director/packs/session.js | 137 | operand || | OPEN | No proof |
| a0538 | src/director/packs/session.js | 137 | comparison | OPEN | No proof |
| a0539 | src/director/packs/session.js | 138 | call | OPEN | No proof |
| a0540 | src/director/packs/session.js | 139 | call | OPEN | No proof |
| a0541 | src/director/packs/session.js | 142 | call | OPEN | No proof |
| a0542 | src/director/packs/session.js | 142 | argument push 1 | OPEN | No proof |
| a0543 | src/director/packs/session.js | 144 | call | OPEN | No proof |
| a0544 | src/director/packs/session.js | 145 | call | TESTED | m328 |
| a0545 | src/director/packs/session.js | 145 | argument clearTimeout 1 | OPEN | No proof |
| a0546 | src/director/packs/session.js | 149 | operand || | TESTED | m180 |
| a0547 | src/director/packs/session.js | 149 | operand || | OPEN | No proof |
| a0548 | src/director/packs/session.js | 149 | operand || | OPEN | No proof |
| a0549 | src/director/packs/session.js | 149 | operand || | OPEN | No proof |
| a0550 | src/director/packs/session.js | 149 | comparison | OPEN | No proof |
| a0551 | src/director/packs/session.js | 149 | optional | OPEN | No proof |
| a0552 | src/director/packs/session.js | 150 | comparison | OPEN | No proof |
| a0553 | src/director/packs/session.js | 150 | call | OPEN | No proof |
| a0554 | src/director/packs/session.js | 153 | constructor | TESTED | m069,m252,m295 |
| a0555 | src/director/packs/session.js | 154 | constructor argument 1 | OPEN | No proof |
| a0556 | src/director/packs/source.js | 6 | default | TESTED | m340 |
| a0557 | src/director/packs/source.js | 8 | constructor | OPEN | No proof |
| a0558 | src/director/packs/source.js | 8 | constructor argument 1 | OPEN | No proof |
| a0559 | src/director/packs/source.js | 10 | operand || | TESTED | m082,m083,m084,m085,m086,m185 |
| a0560 | src/director/packs/source.js | 15 | operand || | TESTED | m087 |
| a0561 | src/director/packs/source.js | 10 | operand || | TESTED | m082,m083,m084,m085,m185 |
| a0562 | src/director/packs/source.js | 14 | operand || | TESTED | m086 |
| a0563 | src/director/packs/source.js | 10 | operand || | TESTED | m082,m083,m084,m185 |
| a0564 | src/director/packs/source.js | 13 | operand || | TESTED | m085 |
| a0565 | src/director/packs/source.js | 10 | operand || | TESTED | m082,m083,m185 |
| a0566 | src/director/packs/source.js | 12 | operand || | TESTED | m084 |
| a0567 | src/director/packs/source.js | 10 | operand || | TESTED | m082,m185 |
| a0568 | src/director/packs/source.js | 11 | operand || | TESTED | m083 |
| a0569 | src/director/packs/source.js | 10 | call | OPEN | No proof |
| a0570 | src/director/packs/source.js | 10 | argument includes 1 | OPEN | No proof |
| a0571 | src/director/packs/source.js | 15 | call | OPEN | No proof |
| a0572 | src/director/packs/source.js | 15 | argument endsWith 1 | OPEN | No proof |
| a0573 | src/director/packs/source.js | 17 | constructor | OPEN | No proof |
| a0574 | src/director/packs/source.js | 18 | constructor argument 1 | OPEN | No proof |
| a0575 | src/director/packs/source.js | 20 | default | TESTED | m214,m381 |
| a0576 | src/director/packs/source.js | 21 | call | OPEN | No proof |
| a0577 | src/director/packs/source.js | 21 | argument validateAssetPath 1 | OPEN | No proof |
| a0578 | src/director/packs/source.js | 22 | optional | TESTED | m184 |
| a0579 | src/director/packs/source.js | 22 | call | TESTED | m184 |
| a0580 | src/director/packs/source.js | 22 | optional | OPEN | No proof |
| a0581 | src/director/packs/source.js | 23 | call | TESTED | m088,m207,m208,m209,m210,m246,m292 |
| a0582 | src/director/packs/source.js | 23 | argument fetchImpl 1 | OPEN | No proof |
| a0583 | src/director/packs/source.js | 23 | argument fetchImpl 2 | TESTED | m088,m207,m208,m209,m210,m246,m292 |
| a0584 | src/director/packs/source.js | 23 | constructor | OPEN | No proof |
| a0585 | src/director/packs/source.js | 23 | constructor argument 1 | OPEN | No proof |
| a0586 | src/director/packs/source.js | 23 | constructor argument 2 | OPEN | No proof |
| a0587 | src/director/packs/source.js | 25 | initial field value | OPEN | No proof |
| a0588 | src/director/packs/source.js | 26 | initial field value | TESTED | m246 |
| a0589 | src/director/packs/source.js | 27 | initial field value | OPEN | No proof |
| a0590 | src/director/packs/source.js | 28 | initial field value | TESTED | m088 |
| a0591 | src/director/packs/source.js | 31 | optional | TESTED | m095,m096 |
| a0592 | src/director/packs/source.js | 31 | call | TESTED | m095,m096 |
| a0593 | src/director/packs/source.js | 31 | argument catch 1 | OPEN | No proof |
| a0594 | src/director/packs/source.js | 31 | optional | TESTED | m096 |
| a0595 | src/director/packs/source.js | 31 | optional | TESTED | m096 |
| a0596 | src/director/packs/source.js | 31 | call | TESTED | m096 |
| a0597 | src/director/packs/source.js | 31 | optional | TESTED | m096 |
| a0598 | src/director/packs/source.js | 32 | constructor | OPEN | No proof |
| a0599 | src/director/packs/source.js | 32 | constructor argument 1 | OPEN | No proof |
| a0600 | src/director/packs/source.js | 34 | optional | OPEN | No proof |
| a0601 | src/director/packs/source.js | 34 | call | OPEN | No proof |
| a0602 | src/director/packs/source.js | 34 | optional | OPEN | No proof |
| a0603 | src/director/packs/source.js | 35 | constructor | OPEN | No proof |
| a0604 | src/director/packs/source.js | 35 | constructor argument 1 | OPEN | No proof |
| a0605 | src/director/packs/source.js | 36 | initial value | OPEN | No proof |
| a0606 | src/director/packs/source.js | 37 | initial value | OPEN | No proof |
| a0607 | src/director/packs/source.js | 39 | comparison | TESTED | m090,m294 |
| a0608 | src/director/packs/source.js | 39 | call | OPEN | No proof |
| a0609 | src/director/packs/source.js | 39 | argument Number 1 | OPEN | No proof |
| a0610 | src/director/packs/source.js | 39 | call | OPEN | No proof |
| a0611 | src/director/packs/source.js | 39 | argument get 1 | OPEN | No proof |
| a0612 | src/director/packs/source.js | 40 | constructor | OPEN | No proof |
| a0613 | src/director/packs/source.js | 40 | constructor argument 1 | OPEN | No proof |
| a0614 | src/director/packs/source.js | 42 | optional | TESTED | m098,m243 |
| a0615 | src/director/packs/source.js | 42 | call | TESTED | m098,m243 |
| a0616 | src/director/packs/source.js | 42 | optional | OPEN | No proof |
| a0617 | src/director/packs/source.js | 43 | call | OPEN | No proof |
| a0618 | src/director/packs/source.js | 46 | comparison | TESTED | m091,m293 |
| a0619 | src/director/packs/source.js | 46 | constructor | OPEN | No proof |
| a0620 | src/director/packs/source.js | 46 | constructor argument 1 | OPEN | No proof |
| a0621 | src/director/packs/source.js | 47 | call | OPEN | No proof |
| a0622 | src/director/packs/source.js | 47 | argument push 1 | OPEN | No proof |
| a0623 | src/director/packs/source.js | 50 | call | TESTED | m097 |
| a0624 | src/director/packs/source.js | 50 | argument catch 1 | OPEN | No proof |
| a0625 | src/director/packs/source.js | 50 | call | OPEN | No proof |
| a0626 | src/director/packs/source.js | 51 | call | OPEN | No proof |
| a0627 | src/director/packs/source.js | 53 | constructor | OPEN | No proof |
| a0628 | src/director/packs/source.js | 53 | constructor argument 1 | OPEN | No proof |
| a0629 | src/director/packs/source.js | 54 | initial value | OPEN | No proof |
| a0630 | src/director/packs/source.js | 56 | call | OPEN | No proof |
| a0631 | src/director/packs/source.js | 56 | argument set 1 | OPEN | No proof |
| a0632 | src/director/packs/source.js | 56 | argument set 2 | OPEN | No proof |
| a0633 | src/director/packs/source.js | 61 | call | TESTED | m092,m093 |
| a0634 | src/director/packs/source.js | 61 | call | TESTED | m092 |
| a0635 | src/director/packs/source.js | 61 | call | TESTED | m092 |
| a0636 | src/director/packs/source.js | 62 | argument split 1 | OPEN | No proof |
| a0637 | src/director/packs/source.js | 61 | operand || | OPEN | No proof |
| a0638 | src/director/packs/source.js | 61 | operand || | TESTED | m092 |
| a0639 | src/director/packs/source.js | 61 | call | OPEN | No proof |
| a0640 | src/director/packs/source.js | 61 | argument get 1 | OPEN | No proof |
| a0641 | src/director/sharing/bundle.js | 6 | initial value | OPEN | No proof |
| a0642 | src/director/sharing/bundle.js | 7 | call | OPEN | No proof |
| a0643 | src/director/sharing/bundle.js | 7 | argument freeze 1 | OPEN | No proof |
| a0644 | src/director/sharing/bundle.js | 9 | initial field value | OPEN | No proof |
| a0645 | src/director/sharing/bundle.js | 11 | set | TESTED | m274,m275,m276,m277,m278,m279,m280,m281,m282 |
| a0646 | src/director/sharing/bundle.js | 11 | constructor argument 1 | TESTED | m274,m275,m276,m277,m278,m279,m280,m281,m282 |
| a0647 | src/director/sharing/bundle.js | 23 | call | TESTED | m187,m188 |
| a0648 | src/director/sharing/bundle.js | 23 | argument flatMap 1 | TESTED | m187,m188 |
| a0649 | src/director/sharing/bundle.js | 23 | operand || | OPEN | No proof |
| a0650 | src/director/sharing/bundle.js | 23 | operand || | OPEN | No proof |
| a0651 | src/director/sharing/bundle.js | 24 | optional | OPEN | No proof |
| a0652 | src/director/sharing/bundle.js | 24 | call | OPEN | No proof |
| a0653 | src/director/sharing/bundle.js | 24 | optional | OPEN | No proof |
| a0654 | src/director/sharing/bundle.js | 26 | call | OPEN | No proof |
| a0655 | src/director/sharing/bundle.js | 29 | argument join 1 | OPEN | No proof |
| a0656 | src/director/sharing/bundle.js | 26 | call | OPEN | No proof |
| a0657 | src/director/sharing/bundle.js | 27 | argument from 1 | OPEN | No proof |
| a0658 | src/director/sharing/bundle.js | 28 | argument from 2 | OPEN | No proof |
| a0659 | src/director/sharing/bundle.js | 27 | constructor | OPEN | No proof |
| a0660 | src/director/sharing/bundle.js | 27 | constructor argument 1 | OPEN | No proof |
| a0661 | src/director/sharing/bundle.js | 27 | call | OPEN | No proof |
| a0662 | src/director/sharing/bundle.js | 27 | argument digest 1 | OPEN | No proof |
| a0663 | src/director/sharing/bundle.js | 27 | argument digest 2 | OPEN | No proof |
| a0664 | src/director/sharing/bundle.js | 28 | call | OPEN | No proof |
| a0665 | src/director/sharing/bundle.js | 28 | argument padStart 1 | OPEN | No proof |
| a0666 | src/director/sharing/bundle.js | 28 | argument padStart 2 | OPEN | No proof |
| a0667 | src/director/sharing/bundle.js | 28 | call | OPEN | No proof |
| a0668 | src/director/sharing/bundle.js | 28 | argument toString 1 | OPEN | No proof |
| a0669 | src/director/sharing/bundle.js | 31 | initial value | OPEN | No proof |
| a0670 | src/director/sharing/bundle.js | 32 | initial value | OPEN | No proof |
| a0671 | src/director/sharing/bundle.js | 32 | comparison | OPEN | No proof |
| a0672 | src/director/sharing/bundle.js | 33 | call | OPEN | No proof |
| a0673 | src/director/sharing/bundle.js | 33 | argument push 1 | OPEN | No proof |
| a0674 | src/director/sharing/bundle.js | 33 | call | OPEN | No proof |
| a0675 | src/director/sharing/bundle.js | 33 | argument fromCharCode 1 | OPEN | No proof |
| a0676 | src/director/sharing/bundle.js | 33 | call | OPEN | No proof |
| a0677 | src/director/sharing/bundle.js | 33 | argument subarray 1 | OPEN | No proof |
| a0678 | src/director/sharing/bundle.js | 33 | argument subarray 2 | OPEN | No proof |
| a0679 | src/director/sharing/bundle.js | 34 | call | OPEN | No proof |
| a0680 | src/director/sharing/bundle.js | 34 | argument btoa 1 | OPEN | No proof |
| a0681 | src/director/sharing/bundle.js | 34 | call | OPEN | No proof |
| a0682 | src/director/sharing/bundle.js | 34 | argument join 1 | OPEN | No proof |
| a0683 | src/director/sharing/bundle.js | 38 | operand || | TESTED | m104,m105,m106,m107,m108,m202,m343 |
| a0684 | src/director/sharing/bundle.js | 43 | operand || | TESTED | m109,m193 |
| a0685 | src/director/sharing/bundle.js | 38 | operand || | TESTED | m104,m105,m106,m107,m202,m343 |
| a0686 | src/director/sharing/bundle.js | 42 | operand || | TESTED | m108 |
| a0687 | src/director/sharing/bundle.js | 38 | operand || | TESTED | m104,m105,m106,m202,m343 |
| a0688 | src/director/sharing/bundle.js | 41 | operand || | TESTED | m107 |
| a0689 | src/director/sharing/bundle.js | 38 | operand || | TESTED | m104,m105,m202 |
| a0690 | src/director/sharing/bundle.js | 40 | operand || | TESTED | m106,m343 |
| a0691 | src/director/sharing/bundle.js | 38 | operand || | TESTED | m104,m202 |
| a0692 | src/director/sharing/bundle.js | 39 | operand || | TESTED | m105 |
| a0693 | src/director/sharing/bundle.js | 38 | comparison | TESTED | m104,m202 |
| a0694 | src/director/sharing/bundle.js | 40 | comparison | TESTED | m106,m343 |
| a0695 | src/director/sharing/bundle.js | 40 | call | OPEN | No proof |
| a0696 | src/director/sharing/bundle.js | 40 | argument ceil 1 | OPEN | No proof |
| a0697 | src/director/sharing/bundle.js | 41 | comparison | TESTED | m107 |
| a0698 | src/director/sharing/bundle.js | 42 | call | TESTED | m108 |
| a0699 | src/director/sharing/bundle.js | 42 | argument test 1 | OPEN | No proof |
| a0700 | src/director/sharing/bundle.js | 42 | regex | OPEN | No proof |
| a0701 | src/director/sharing/bundle.js | 42 | regex part | OPEN | No proof |
| a0702 | src/director/sharing/bundle.js | 43 | operand && | OPEN | No proof |
| a0703 | src/director/sharing/bundle.js | 43 | operand && | TESTED | m109 |
| a0704 | src/director/sharing/bundle.js | 43 | call | OPEN | No proof |
| a0705 | src/director/sharing/bundle.js | 43 | argument includes 1 | OPEN | No proof |
| a0706 | src/director/sharing/bundle.js | 43 | call | OPEN | No proof |
| a0707 | src/director/sharing/bundle.js | 43 | argument test 1 | OPEN | No proof |
| a0708 | src/director/sharing/bundle.js | 43 | regex | OPEN | No proof |
| a0709 | src/director/sharing/bundle.js | 43 | regex part | OPEN | No proof |
| a0710 | src/director/sharing/bundle.js | 43 | regex part | OPEN | No proof |
| a0711 | src/director/sharing/bundle.js | 43 | regex part | OPEN | No proof |
| a0712 | src/director/sharing/bundle.js | 45 | call | OPEN | No proof |
| a0713 | src/director/sharing/bundle.js | 45 | argument fail 1 | OPEN | No proof |
| a0714 | src/director/sharing/bundle.js | 45 | argument fail 2 | OPEN | No proof |
| a0715 | src/director/sharing/bundle.js | 46 | call | OPEN | No proof |
| a0716 | src/director/sharing/bundle.js | 46 | argument from 1 | OPEN | No proof |
| a0717 | src/director/sharing/bundle.js | 46 | argument from 2 | OPEN | No proof |
| a0718 | src/director/sharing/bundle.js | 46 | call | OPEN | No proof |
| a0719 | src/director/sharing/bundle.js | 46 | argument atob 1 | OPEN | No proof |
| a0720 | src/director/sharing/bundle.js | 46 | call | OPEN | No proof |
| a0721 | src/director/sharing/bundle.js | 46 | argument charCodeAt 1 | OPEN | No proof |
| a0722 | src/director/sharing/bundle.js | 50 | operand || | TESTED | m120,m121,m122,m257,m341 |
| a0723 | src/director/sharing/bundle.js | 53 | operand || | TESTED | m126,m342,m349 |
| a0724 | src/director/sharing/bundle.js | 50 | operand || | TESTED | m120,m121 |
| a0725 | src/director/sharing/bundle.js | 52 | operand || | TESTED | m122,m257,m341 |
| a0726 | src/director/sharing/bundle.js | 50 | operand || | TESTED | m120 |
| a0727 | src/director/sharing/bundle.js | 51 | operand || | TESTED | m121 |
| a0728 | src/director/sharing/bundle.js | 52 | comparison | TESTED | m122,m257,m341 |
| a0729 | src/director/sharing/bundle.js | 53 | comparison | TESTED | m126,m342,m349 |
| a0730 | src/director/sharing/bundle.js | 55 | call | OPEN | No proof |
| a0731 | src/director/sharing/bundle.js | 55 | argument fail 1 | OPEN | No proof |
| a0732 | src/director/sharing/bundle.js | 55 | argument fail 2 | OPEN | No proof |
| a0733 | src/director/sharing/bundle.js | 58 | call | OPEN | No proof |
| a0734 | src/director/sharing/bundle.js | 58 | argument has 1 | OPEN | No proof |
| a0735 | src/director/sharing/bundle.js | 58 | call | OPEN | No proof |
| a0736 | src/director/sharing/bundle.js | 58 | argument fail 1 | OPEN | No proof |
| a0737 | src/director/sharing/bundle.js | 58 | argument fail 2 | OPEN | No proof |
| a0738 | src/director/sharing/bundle.js | 62 | default | OPEN | No proof |
| a0739 | src/director/sharing/bundle.js | 63 | call | OPEN | No proof |
| a0740 | src/director/sharing/bundle.js | 63 | argument checkAbort 1 | OPEN | No proof |
| a0741 | src/director/sharing/bundle.js | 65 | operand || | TESTED | m099,m102,m186,m382 |
| a0742 | src/director/sharing/bundle.js | 67 | operand || | TESTED | m103,m383 |
| a0743 | src/director/sharing/bundle.js | 65 | operand || | TESTED | m099 |
| a0744 | src/director/sharing/bundle.js | 66 | operand || | TESTED | m102,m186,m382 |
| a0745 | src/director/sharing/bundle.js | 65 | comparison | TESTED | m099 |
| a0746 | src/director/sharing/bundle.js | 66 | comparison | TESTED | m102,m186,m382 |
| a0747 | src/director/sharing/bundle.js | 67 | comparison | TESTED | m103,m383 |
| a0748 | src/director/sharing/bundle.js | 67 | call | OPEN | No proof |
| a0749 | src/director/sharing/bundle.js | 67 | argument encode 1 | OPEN | No proof |
| a0750 | src/director/sharing/bundle.js | 67 | constructor | OPEN | No proof |
| a0751 | src/director/sharing/bundle.js | 69 | call | OPEN | No proof |
| a0752 | src/director/sharing/bundle.js | 69 | argument fail 1 | OPEN | No proof |
| a0753 | src/director/sharing/bundle.js | 69 | argument fail 2 | OPEN | No proof |
| a0754 | src/director/sharing/bundle.js | 72 | call | OPEN | No proof |
| a0755 | src/director/sharing/bundle.js | 72 | argument parse 1 | OPEN | No proof |
| a0756 | src/director/sharing/bundle.js | 74 | call | TESTED | m100 |
| a0757 | src/director/sharing/bundle.js | 74 | argument fail 1 | OPEN | No proof |
| a0758 | src/director/sharing/bundle.js | 74 | argument fail 2 | OPEN | No proof |
| a0759 | src/director/sharing/bundle.js | 76 | comparison | TESTED | m101,m385 |
| a0760 | src/director/sharing/bundle.js | 76 | optional | TESTED | m385 |
| a0761 | src/director/sharing/bundle.js | 77 | call | TESTED | m384 |
| a0762 | src/director/sharing/bundle.js | 77 | argument parseSceneDocument 1 | OPEN | No proof |
| a0763 | src/director/sharing/bundle.js | 77 | constructor | OPEN | No proof |
| a0764 | src/director/sharing/bundle.js | 78 | call | TESTED | m386 |
| a0765 | src/director/sharing/bundle.js | 78 | argument fields 1 | OPEN | No proof |
| a0766 | src/director/sharing/bundle.js | 78 | argument fields 2 | OPEN | No proof |
| a0767 | src/director/sharing/bundle.js | 78 | argument fields 3 | OPEN | No proof |
| a0768 | src/director/sharing/bundle.js | 79 | comparison | TESTED | m112,m256 |
| a0769 | src/director/sharing/bundle.js | 79 | call | OPEN | No proof |
| a0770 | src/director/sharing/bundle.js | 79 | argument fail 1 | OPEN | No proof |
| a0771 | src/director/sharing/bundle.js | 79 | argument fail 2 | OPEN | No proof |
| a0772 | src/director/sharing/bundle.js | 80 | call | TESTED | m387 |
| a0773 | src/director/sharing/bundle.js | 80 | argument parseSceneDocument 1 | OPEN | No proof |
| a0774 | src/director/sharing/bundle.js | 80 | call | OPEN | No proof |
| a0775 | src/director/sharing/bundle.js | 80 | argument stringify 1 | OPEN | No proof |
| a0776 | src/director/sharing/bundle.js | 81 | call | TESTED | m347,m388 |
| a0777 | src/director/sharing/bundle.js | 81 | argument array 1 | OPEN | No proof |
| a0778 | src/director/sharing/bundle.js | 81 | argument array 2 | OPEN | No proof |
| a0779 | src/director/sharing/bundle.js | 81 | argument array 3 | TESTED | m388 |
| a0780 | src/director/sharing/bundle.js | 82 | constructor | OPEN | No proof |
| a0781 | src/director/sharing/bundle.js | 83 | initial value | OPEN | No proof |
| a0782 | src/director/sharing/bundle.js | 85 | call | TESTED | m351 |
| a0783 | src/director/sharing/bundle.js | 85 | argument checkAbort 1 | OPEN | No proof |
| a0784 | src/director/sharing/bundle.js | 86 | call | OPEN | No proof |
| a0785 | src/director/sharing/bundle.js | 86 | argument fields 1 | OPEN | No proof |
| a0786 | src/director/sharing/bundle.js | 86 | argument fields 2 | OPEN | No proof |
| a0787 | src/director/sharing/bundle.js | 86 | argument fields 3 | OPEN | No proof |
| a0788 | src/director/sharing/bundle.js | 87 | call | OPEN | No proof |
| a0789 | src/director/sharing/bundle.js | 87 | argument validateAssetPath 1 | OPEN | No proof |
| a0790 | src/director/sharing/bundle.js | 88 | call | OPEN | No proof |
| a0791 | src/director/sharing/bundle.js | 88 | argument checkMime 1 | OPEN | No proof |
| a0792 | src/director/sharing/bundle.js | 89 | call | TESTED | m110 |
| a0793 | src/director/sharing/bundle.js | 89 | argument has 1 | OPEN | No proof |
| a0794 | src/director/sharing/bundle.js | 89 | call | OPEN | No proof |
| a0795 | src/director/sharing/bundle.js | 89 | argument fail 1 | OPEN | No proof |
| a0796 | src/director/sharing/bundle.js | 89 | argument fail 2 | OPEN | No proof |
| a0797 | src/director/sharing/bundle.js | 90 | call | OPEN | No proof |
| a0798 | src/director/sharing/bundle.js | 90 | argument decode 1 | OPEN | No proof |
| a0799 | src/director/sharing/bundle.js | 92 | call | TESTED | m348 |
| a0800 | src/director/sharing/bundle.js | 92 | argument checkBytes 1 | OPEN | No proof |
| a0801 | src/director/sharing/bundle.js | 92 | argument checkBytes 2 | OPEN | No proof |
| a0802 | src/director/sharing/bundle.js | 93 | call | OPEN | No proof |
| a0803 | src/director/sharing/bundle.js | 93 | argument digest 1 | OPEN | No proof |
| a0804 | src/director/sharing/bundle.js | 94 | call | TESTED | m352 |
| a0805 | src/director/sharing/bundle.js | 94 | argument checkAbort 1 | OPEN | No proof |
| a0806 | src/director/sharing/bundle.js | 95 | comparison | TESTED | m116 |
| a0807 | src/director/sharing/bundle.js | 95 | call | OPEN | No proof |
| a0808 | src/director/sharing/bundle.js | 95 | argument fail 1 | OPEN | No proof |
| a0809 | src/director/sharing/bundle.js | 95 | argument fail 2 | OPEN | No proof |
| a0810 | src/director/sharing/bundle.js | 96 | call | OPEN | No proof |
| a0811 | src/director/sharing/bundle.js | 96 | argument set 1 | OPEN | No proof |
| a0812 | src/director/sharing/bundle.js | 96 | argument set 2 | OPEN | No proof |
| a0813 | src/director/sharing/bundle.js | 98 | set | OPEN | No proof |
| a0814 | src/director/sharing/bundle.js | 99 | call | TESTED | m228 |
| a0815 | src/director/sharing/bundle.js | 99 | argument packsOf 1 | OPEN | No proof |
| a0816 | src/director/sharing/bundle.js | 100 | comparison | TESTED | m118 |
| a0817 | src/director/sharing/bundle.js | 101 | call | OPEN | No proof |
| a0818 | src/director/sharing/bundle.js | 101 | argument fail 1 | OPEN | No proof |
| a0819 | src/director/sharing/bundle.js | 101 | argument fail 2 | OPEN | No proof |
| a0820 | src/director/sharing/bundle.js | 102 | call | OPEN | No proof |
| a0821 | src/director/sharing/bundle.js | 102 | argument get 1 | OPEN | No proof |
| a0822 | src/director/sharing/bundle.js | 103 | call | OPEN | No proof |
| a0823 | src/director/sharing/bundle.js | 103 | argument add 1 | OPEN | No proof |
| a0824 | src/director/sharing/bundle.js | 105 | operand || | TESTED | m113,m114 |
| a0825 | src/director/sharing/bundle.js | 107 | operand || | TESTED | m115 |
| a0826 | src/director/sharing/bundle.js | 105 | operand || | TESTED | m113 |
| a0827 | src/director/sharing/bundle.js | 106 | operand || | TESTED | m114 |
| a0828 | src/director/sharing/bundle.js | 106 | comparison | TESTED | m114 |
| a0829 | src/director/sharing/bundle.js | 107 | comparison | TESTED | m115 |
| a0830 | src/director/sharing/bundle.js | 109 | call | OPEN | No proof |
| a0831 | src/director/sharing/bundle.js | 109 | argument fail 1 | OPEN | No proof |
| a0832 | src/director/sharing/bundle.js | 109 | argument fail 2 | OPEN | No proof |
| a0833 | src/director/sharing/bundle.js | 111 | comparison | TESTED | m117 |
| a0834 | src/director/sharing/bundle.js | 111 | call | OPEN | No proof |
| a0835 | src/director/sharing/bundle.js | 111 | argument fail 1 | OPEN | No proof |
| a0836 | src/director/sharing/bundle.js | 111 | argument fail 2 | OPEN | No proof |
| a0837 | src/director/sharing/bundle.js | 117 | ternary condition | TESTED | m136,m138 |
| a0838 | src/director/sharing/bundle.js | 118 | ternary value | OPEN | No proof |
| a0839 | src/director/sharing/bundle.js | 119 | ternary value | OPEN | No proof |
| a0840 | src/director/sharing/bundle.js | 117 | optional | TESTED | m136,m138 |
| a0841 | src/director/sharing/bundle.js | 117 | call | TESTED | m136,m138 |
| a0842 | src/director/sharing/bundle.js | 117 | argument endsWith 1 | OPEN | No proof |
| a0843 | src/director/sharing/bundle.js | 117 | optional | TESTED | m136 |
| a0844 | src/director/sharing/bundle.js | 120 | comparison | TESTED | m137,m261,m344,m345 |
| a0845 | src/director/sharing/bundle.js | 121 | call | OPEN | No proof |
| a0846 | src/director/sharing/bundle.js | 122 | argument fail 1 | OPEN | No proof |
| a0847 | src/director/sharing/bundle.js | 123 | argument fail 2 | OPEN | No proof |
| a0848 | src/director/sharing/bundle.js | 123 | ternary condition | OPEN | No proof |
| a0849 | src/director/sharing/bundle.js | 124 | ternary value | OPEN | No proof |
| a0850 | src/director/sharing/bundle.js | 125 | ternary value | OPEN | No proof |
| a0851 | src/director/sharing/bundle.js | 123 | comparison | OPEN | No proof |
| a0852 | src/director/sharing/bundle.js | 127 | call | OPEN | No proof |
| a0853 | src/director/sharing/bundle.js | 127 | argument checkAbort 1 | OPEN | No proof |
| a0854 | src/director/sharing/bundle.js | 127 | optional | OPEN | No proof |
| a0855 | src/director/sharing/bundle.js | 128 | call | OPEN | No proof |
| a0856 | src/director/sharing/bundle.js | 128 | argument withShareSignal 1 | OPEN | No proof |
| a0857 | src/director/sharing/bundle.js | 128 | argument withShareSignal 2 | OPEN | No proof |
| a0858 | src/director/sharing/bundle.js | 128 | call | OPEN | No proof |
| a0859 | src/director/sharing/bundle.js | 128 | optional | OPEN | No proof |
| a0860 | src/director/sharing/bundle.js | 129 | call | TESTED | m234 |
| a0861 | src/director/sharing/bundle.js | 129 | argument checkAbort 1 | TESTED | m234 |
| a0862 | src/director/sharing/bundle.js | 129 | optional | TESTED | m234 |
| a0863 | src/director/sharing/bundle.js | 130 | call | OPEN | No proof |
| a0864 | src/director/sharing/bundle.js | 130 | argument parseSceneShare 1 | OPEN | No proof |
| a0865 | src/director/sharing/bundle.js | 130 | argument parseSceneShare 2 | OPEN | No proof |
| a0866 | src/director/sharing/bundle.js | 137 | default | OPEN | No proof |
| a0867 | src/director/sharing/bundle.js | 139 | call | EQUIVALENT | m389; evidence/probe-export-parser.txt |
| a0868 | src/director/sharing/bundle.js | 139 | argument parseSceneDocument 1 | OPEN | No proof |
| a0869 | src/director/sharing/bundle.js | 139 | call | OPEN | No proof |
| a0870 | src/director/sharing/bundle.js | 139 | argument stringifySceneDocument 1 | OPEN | No proof |
| a0871 | src/director/sharing/bundle.js | 140 | initial value | OPEN | No proof |
| a0872 | src/director/sharing/bundle.js | 141 | constructor | OPEN | No proof |
| a0873 | src/director/sharing/bundle.js | 142 | initial value | OPEN | No proof |
| a0874 | src/director/sharing/bundle.js | 143 | call | OPEN | No proof |
| a0875 | src/director/sharing/bundle.js | 143 | argument packsOf 1 | OPEN | No proof |
| a0876 | src/director/sharing/bundle.js | 144 | call | OPEN | No proof |
| a0877 | src/director/sharing/bundle.js | 144 | argument checkAbort 1 | OPEN | No proof |
| a0878 | src/director/sharing/bundle.js | 145 | call | TESTED | m203,m204 |
| a0879 | src/director/sharing/bundle.js | 145 | argument stringify 1 | TESTED | m203,m204 |
| a0880 | src/director/sharing/bundle.js | 146 | call | TESTED | m128 |
| a0881 | src/director/sharing/bundle.js | 146 | argument get 1 | OPEN | No proof |
| a0882 | src/director/sharing/bundle.js | 148 | comparison | TESTED | m127,m290,m367 |
| a0883 | src/director/sharing/bundle.js | 149 | call | OPEN | No proof |
| a0884 | src/director/sharing/bundle.js | 149 | argument fail 1 | OPEN | No proof |
| a0885 | src/director/sharing/bundle.js | 149 | argument fail 2 | OPEN | No proof |
| a0886 | src/director/sharing/bundle.js | 150 | call | TESTED | m390,m391 |
| a0887 | src/director/sharing/bundle.js | 151 | argument withShareSignal 1 | TESTED | m390,m391 |
| a0888 | src/director/sharing/bundle.js | 152 | argument withShareSignal 2 | OPEN | No proof |
| a0889 | src/director/sharing/bundle.js | 151 | call | TESTED | m390,m391 |
| a0890 | src/director/sharing/bundle.js | 151 | argument resolveAsset 1 | TESTED | m390 |
| a0891 | src/director/sharing/bundle.js | 151 | argument resolveAsset 2 | TESTED | m391 |
| a0892 | src/director/sharing/bundle.js | 154 | call | TESTED | m354 |
| a0893 | src/director/sharing/bundle.js | 154 | argument checkAbort 1 | OPEN | No proof |
| a0894 | src/director/sharing/bundle.js | 155 | call | TESTED | m123 |
| a0895 | src/director/sharing/bundle.js | 155 | argument fail 1 | OPEN | No proof |
| a0896 | src/director/sharing/bundle.js | 155 | argument fail 2 | OPEN | No proof |
| a0897 | src/director/sharing/bundle.js | 157 | operand || | TESTED | m231 |
| a0898 | src/director/sharing/bundle.js | 157 | operand || | OPEN | No proof |
| a0899 | src/director/sharing/bundle.js | 157 | optional | TESTED | m231 |
| a0900 | src/director/sharing/bundle.js | 158 | call | OPEN | No proof |
| a0901 | src/director/sharing/bundle.js | 158 | argument checkBytes 1 | OPEN | No proof |
| a0902 | src/director/sharing/bundle.js | 158 | argument checkBytes 2 | OPEN | No proof |
| a0903 | src/director/sharing/bundle.js | 159 | call | TESTED | m346 |
| a0904 | src/director/sharing/bundle.js | 159 | argument checkMime 1 | OPEN | No proof |
| a0905 | src/director/sharing/bundle.js | 160 | call | OPEN | No proof |
| a0906 | src/director/sharing/bundle.js | 160 | argument digest 1 | OPEN | No proof |
| a0907 | src/director/sharing/bundle.js | 161 | call | TESTED | m355 |
| a0908 | src/director/sharing/bundle.js | 161 | argument checkAbort 1 | OPEN | No proof |
| a0909 | src/director/sharing/bundle.js | 163 | operand || | TESTED | m124,m189 |
| a0910 | src/director/sharing/bundle.js | 164 | operand || | TESTED | m125,m190 |
| a0911 | src/director/sharing/bundle.js | 163 | operand && | OPEN | No proof |
| a0912 | src/director/sharing/bundle.js | 163 | operand && | TESTED | m124 |
| a0913 | src/director/sharing/bundle.js | 163 | comparison | TESTED | m124 |
| a0914 | src/director/sharing/bundle.js | 164 | operand && | OPEN | No proof |
| a0915 | src/director/sharing/bundle.js | 164 | operand && | TESTED | m125 |
| a0916 | src/director/sharing/bundle.js | 164 | comparison | TESTED | m125 |
| a0917 | src/director/sharing/bundle.js | 166 | call | OPEN | No proof |
| a0918 | src/director/sharing/bundle.js | 166 | argument fail 1 | OPEN | No proof |
| a0919 | src/director/sharing/bundle.js | 166 | argument fail 2 | OPEN | No proof |
| a0920 | src/director/sharing/bundle.js | 167 | call | TESTED | m263 |
| a0921 | src/director/sharing/bundle.js | 167 | argument slice 1 | OPEN | No proof |
| a0922 | src/director/sharing/bundle.js | 167 | argument slice 2 | OPEN | No proof |
| a0923 | src/director/sharing/bundle.js | 167 | call | OPEN | No proof |
| a0924 | src/director/sharing/bundle.js | 167 | argument at 1 | OPEN | No proof |
| a0925 | src/director/sharing/bundle.js | 167 | call | OPEN | No proof |
| a0926 | src/director/sharing/bundle.js | 167 | argument split 1 | OPEN | No proof |
| a0927 | src/director/sharing/bundle.js | 171 | call | TESTED | m299 |
| a0928 | src/director/sharing/bundle.js | 171 | argument encode 1 | OPEN | No proof |
| a0929 | src/director/sharing/bundle.js | 175 | call | OPEN | No proof |
| a0930 | src/director/sharing/bundle.js | 175 | argument set 1 | OPEN | No proof |
| a0931 | src/director/sharing/bundle.js | 175 | argument set 2 | OPEN | No proof |
| a0932 | src/director/sharing/bundle.js | 176 | call | OPEN | No proof |
| a0933 | src/director/sharing/bundle.js | 176 | argument push 1 | OPEN | No proof |
| a0934 | src/director/sharing/bundle.js | 178 | operand || | TESTED | m129,m191,m258 |
| a0935 | src/director/sharing/bundle.js | 179 | operand || | TESTED | m130,m192,m230 |
| a0936 | src/director/sharing/bundle.js | 178 | operand && | OPEN | No proof |
| a0937 | src/director/sharing/bundle.js | 178 | operand && | TESTED | m129,m258 |
| a0938 | src/director/sharing/bundle.js | 178 | comparison | TESTED | m129,m258 |
| a0939 | src/director/sharing/bundle.js | 179 | operand && | OPEN | No proof |
| a0940 | src/director/sharing/bundle.js | 179 | operand && | TESTED | m130,m230 |
| a0941 | src/director/sharing/bundle.js | 179 | comparison | TESTED | m130,m230 |
| a0942 | src/director/sharing/bundle.js | 181 | call | OPEN | No proof |
| a0943 | src/director/sharing/bundle.js | 181 | argument fail 1 | OPEN | No proof |
| a0944 | src/director/sharing/bundle.js | 181 | argument fail 2 | OPEN | No proof |
| a0945 | src/director/sharing/bundle.js | 186 | call | TESTED | m300 |
| a0946 | src/director/sharing/bundle.js | 186 | argument stringify 1 | TESTED | m300 |
| a0947 | src/director/sharing/bundle.js | 187 | initial field value | OPEN | No proof |
| a0948 | src/director/sharing/bundle.js | 188 | initial field value | OPEN | No proof |
| a0949 | src/director/sharing/bundle.js | 190 | call | OPEN | No proof |
| a0950 | src/director/sharing/bundle.js | 190 | argument map 1 | OPEN | No proof |
| a0951 | src/director/sharing/bundle.js | 192 | comparison | TESTED | m235,m392 |
| a0952 | src/director/sharing/bundle.js | 192 | call | OPEN | No proof |
| a0953 | src/director/sharing/bundle.js | 192 | argument encode 1 | OPEN | No proof |
| a0954 | src/director/sharing/bundle.js | 192 | constructor | OPEN | No proof |
| a0955 | src/director/sharing/bundle.js | 193 | call | OPEN | No proof |
| a0956 | src/director/sharing/bundle.js | 193 | argument fail 1 | OPEN | No proof |
| a0957 | src/director/sharing/bundle.js | 193 | argument fail 2 | OPEN | No proof |
| a0958 | src/director/sharing/bundle.js | 199 | constructor | OPEN | No proof |
| a0959 | src/director/sharing/bundle.js | 201 | default | OPEN | No proof |
| a0960 | src/director/sharing/bundle.js | 201 | constructor | OPEN | No proof |
| a0961 | src/director/sharing/bundle.js | 202 | constructor | TESTED | m131 |
| a0962 | src/director/sharing/bundle.js | 202 | constructor argument 1 | OPEN | No proof |
| a0963 | src/director/sharing/bundle.js | 205 | call | TESTED | m132 |
| a0964 | src/director/sharing/bundle.js | 207 | constructor | OPEN | No proof |
| a0965 | src/director/sharing/bundle.js | 207 | constructor argument 1 | OPEN | No proof |
| a0966 | src/director/sharing/bundle.js | 210 | call | OPEN | No proof |
| a0967 | src/director/sharing/bundle.js | 210 | argument reduce 1 | OPEN | No proof |
| a0968 | src/director/sharing/bundle.js | 210 | argument reduce 2 | OPEN | No proof |
| a0969 | src/director/sharing/bundle.js | 210 | call | OPEN | No proof |
| a0970 | src/director/sharing/bundle.js | 212 | default | OPEN | No proof |
| a0971 | src/director/sharing/bundle.js | 213 | call | TESTED | m350 |
| a0972 | src/director/sharing/bundle.js | 213 | argument checkAbort 1 | OPEN | No proof |
| a0973 | src/director/sharing/bundle.js | 214 | call | OPEN | No proof |
| a0974 | src/director/sharing/bundle.js | 214 | argument validateAssetPath 1 | OPEN | No proof |
| a0975 | src/director/sharing/bundle.js | 215 | call | OPEN | No proof |
| a0976 | src/director/sharing/bundle.js | 215 | argument get 1 | OPEN | No proof |
| a0977 | src/director/sharing/bundle.js | 216 | operand || | OPEN | No proof |
| a0978 | src/director/sharing/bundle.js | 216 | operand || | TESTED | m134,m393 |
| a0979 | src/director/sharing/bundle.js | 216 | comparison | TESTED | m134,m393 |
| a0980 | src/director/sharing/bundle.js | 217 | constructor | OPEN | No proof |
| a0981 | src/director/sharing/bundle.js | 217 | constructor argument 1 | OPEN | No proof |
| a0982 | src/director/sharing/bundle.js | 218 | call | TESTED | m135,m260 |
| a0983 | src/director/sharing/lifetime.js | 3 | call | TESTED | m139 |
| a0984 | src/director/sharing/lifetime.js | 3 | argument resolve 1 | TESTED | m139 |
| a0985 | src/director/sharing/lifetime.js | 4 | constructor | TESTED | m140,m141,m142,m143,m144,m262,m404,m405,m406,m407 |
| a0986 | src/director/sharing/lifetime.js | 4 | constructor argument 1 | TESTED | m140,m141,m142,m143,m144,m262,m404,m405,m406,m407 |
| a0987 | src/director/sharing/lifetime.js | 6 | call | TESTED | m404 |
| a0988 | src/director/sharing/lifetime.js | 6 | argument removeEventListener 1 | OPEN | No proof |
| a0989 | src/director/sharing/lifetime.js | 6 | argument removeEventListener 2 | OPEN | No proof |
| a0990 | src/director/sharing/lifetime.js | 7 | call | TESTED | m144,m262 |
| a0991 | src/director/sharing/lifetime.js | 7 | argument reject 1 | TESTED | m262 |
| a0992 | src/director/sharing/lifetime.js | 10 | call | OPEN | No proof |
| a0993 | src/director/sharing/lifetime.js | 10 | argument catch 1 | OPEN | No proof |
| a0994 | src/director/sharing/lifetime.js | 10 | call | OPEN | No proof |
| a0995 | src/director/sharing/lifetime.js | 10 | argument resolve 1 | OPEN | No proof |
| a0996 | src/director/sharing/lifetime.js | 11 | call | OPEN | No proof |
| a0997 | src/director/sharing/lifetime.js | 14 | call | TESTED | m407 |
| a0998 | src/director/sharing/lifetime.js | 14 | argument addEventListener 1 | OPEN | No proof |
| a0999 | src/director/sharing/lifetime.js | 14 | argument addEventListener 2 | OPEN | No proof |
| a1000 | src/director/sharing/lifetime.js | 14 | argument addEventListener 3 | OPEN | No proof |
| a1001 | src/director/sharing/lifetime.js | 14 | initial field value | OPEN | No proof |
| a1002 | src/director/sharing/lifetime.js | 15 | call | TESTED | m141,m142,m143,m405,m406 |
| a1003 | src/director/sharing/lifetime.js | 16 | argument then 1 | TESTED | m141,m143,m405 |
| a1004 | src/director/sharing/lifetime.js | 20 | argument then 2 | TESTED | m142,m406 |
| a1005 | src/director/sharing/lifetime.js | 15 | call | OPEN | No proof |
| a1006 | src/director/sharing/lifetime.js | 15 | argument resolve 1 | OPEN | No proof |
| a1007 | src/director/sharing/lifetime.js | 17 | call | OPEN | No proof |
| a1008 | src/director/sharing/lifetime.js | 17 | argument removeEventListener 1 | OPEN | No proof |
| a1009 | src/director/sharing/lifetime.js | 17 | argument removeEventListener 2 | OPEN | No proof |
| a1010 | src/director/sharing/lifetime.js | 18 | ternary condition | OPEN | No proof |
| a1011 | src/director/sharing/lifetime.js | 18 | ternary value | OPEN | No proof |
| a1012 | src/director/sharing/lifetime.js | 18 | ternary value | OPEN | No proof |
| a1013 | src/director/sharing/lifetime.js | 18 | call | OPEN | No proof |
| a1014 | src/director/sharing/lifetime.js | 18 | argument reject 1 | OPEN | No proof |
| a1015 | src/director/sharing/lifetime.js | 18 | call | OPEN | No proof |
| a1016 | src/director/sharing/lifetime.js | 18 | argument resolve 1 | OPEN | No proof |
| a1017 | src/director/sharing/lifetime.js | 21 | call | TESTED | m406 |
| a1018 | src/director/sharing/lifetime.js | 21 | argument removeEventListener 1 | OPEN | No proof |
| a1019 | src/director/sharing/lifetime.js | 21 | argument removeEventListener 2 | OPEN | No proof |
| a1020 | src/director/sharing/lifetime.js | 22 | call | TESTED | m142 |
| a1021 | src/director/sharing/lifetime.js | 22 | argument reject 1 | OPEN | No proof |
| a1022 | src/director/sharing/preview.js | 6 | default | OPEN | No proof |
| a1023 | src/director/sharing/preview.js | 6 | default | OPEN | No proof |
| a1024 | src/director/sharing/preview.js | 6 | default | OPEN | No proof |
| a1025 | src/director/sharing/preview.js | 8 | set | OPEN | No proof |
| a1026 | src/director/sharing/preview.js | 8 | constructor argument 1 | OPEN | No proof |
| a1027 | src/director/sharing/preview.js | 9 | set | OPEN | No proof |
| a1028 | src/director/sharing/preview.js | 9 | constructor argument 1 | OPEN | No proof |
| a1029 | src/director/sharing/preview.js | 10 | call | TESTED | m146,m147,m148,m149,m150,m194,m195,m196,m197,m259 |
| a1030 | src/director/sharing/preview.js | 10 | argument flatMap 1 | TESTED | m146,m147,m148,m149,m150,m194,m195,m196,m197,m259 |
| a1031 | src/director/sharing/preview.js | 11 | call | TESTED | m146,m147,m148,m149,m150,m194,m195,m196,m197,m259 |
| a1032 | src/director/sharing/preview.js | 11 | argument map 1 | TESTED | m146,m147,m148,m149,m150,m196,m197,m259 |
| a1033 | src/director/sharing/preview.js | 11 | operand || | OPEN | No proof |
| a1034 | src/director/sharing/preview.js | 11 | operand || | OPEN | No proof |
| a1035 | src/director/sharing/preview.js | 12 | operand || | OPEN | No proof |
| a1036 | src/director/sharing/preview.js | 12 | operand || | OPEN | No proof |
| a1037 | src/director/sharing/preview.js | 17 | ternary condition | TESTED | m197 |
| a1038 | src/director/sharing/preview.js | 18 | ternary value | TESTED | m147,m148 |
| a1039 | src/director/sharing/preview.js | 21 | ternary value | TESTED | m149,m150,m259 |
| a1040 | src/director/sharing/preview.js | 17 | comparison | TESTED | m197 |
| a1041 | src/director/sharing/preview.js | 18 | ternary condition | TESTED | m147,m148 |
| a1042 | src/director/sharing/preview.js | 19 | ternary value | OPEN | No proof |
| a1043 | src/director/sharing/preview.js | 20 | ternary value | OPEN | No proof |
| a1044 | src/director/sharing/preview.js | 18 | call | TESTED | m147,m148 |
| a1045 | src/director/sharing/preview.js | 18 | argument has 1 | OPEN | No proof |
| a1046 | src/director/sharing/preview.js | 21 | ternary condition | TESTED | m149,m150,m259 |
| a1047 | src/director/sharing/preview.js | 22 | ternary value | OPEN | No proof |
| a1048 | src/director/sharing/preview.js | 23 | ternary value | OPEN | No proof |
| a1049 | src/director/sharing/preview.js | 21 | call | TESTED | m149,m150,m259 |
| a1050 | src/director/sharing/preview.js | 21 | argument has 1 | OPEN | No proof |
| a1051 | src/director/sharing/preview.js | 28 | call | TESTED | m356,m357 |
| a1052 | src/director/sharing/preview.js | 28 | argument reduce 1 | TESTED | m357 |
| a1053 | src/director/sharing/preview.js | 28 | argument reduce 2 | OPEN | No proof |
| a1054 | src/director/sharing/preview.js | 30 | call | TESTED | m151,m198,m199,m205,m358 |
| a1055 | src/director/sharing/preview.js | 36 | argument filter 1 | TESTED | m151 |
| a1056 | src/director/sharing/preview.js | 31 | set | TESTED | m198,m199,m205,m358 |
| a1057 | src/director/sharing/preview.js | 32 | constructor argument 1 | TESTED | m198,m199,m205 |
| a1058 | src/director/sharing/preview.js | 32 | call | TESTED | m198,m199,m205 |
| a1059 | src/director/sharing/preview.js | 32 | argument flatMap 1 | TESTED | m198,m199,m205 |
| a1060 | src/director/sharing/preview.js | 33 | call | TESTED | m198,m199,m205 |
| a1061 | src/director/sharing/preview.js | 33 | argument flatMap 1 | TESTED | m198,m199,m205 |
| a1062 | src/director/sharing/preview.js | 33 | call | TESTED | m198,m199,m205 |
| a1063 | src/director/sharing/preview.js | 33 | argument keys 1 | TESTED | m198,m199 |
| a1064 | src/director/sharing/preview.js | 33 | operand || | OPEN | No proof |
| a1065 | src/director/sharing/preview.js | 33 | operand || | OPEN | No proof |
| a1066 | src/director/sharing/preview.js | 36 | call | OPEN | No proof |
| a1067 | src/director/sharing/preview.js | 36 | argument has 1 | OPEN | No proof |
| a1068 | src/director/sharing/preview.js | 37 | call | TESTED | m152,m153,m154 |
| a1069 | src/director/sharing/preview.js | 38 | argument some 1 | TESTED | m152,m153,m154 |
| a1070 | src/director/sharing/preview.js | 39 | operand || | TESTED | m152 |
| a1071 | src/director/sharing/preview.js | 39 | operand || | TESTED | m153 |
| a1072 | src/director/sharing/preview.js | 39 | optional | TESTED | m152 |
| a1073 | src/director/sharing/preview.js | 39 | call | TESTED | m153 |
| a1074 | src/director/sharing/preview.js | 39 | argument some 1 | OPEN | No proof |
| a1075 | src/director/sharing/preview.js | 41 | call | TESTED | m145,m206 |
| a1076 | src/director/sharing/preview.js | 41 | argument reduce 1 | TESTED | m145 |
| a1077 | src/director/sharing/preview.js | 41 | argument reduce 2 | OPEN | No proof |
| a1078 | src/director/sharing/preview.js | 41 | call | OPEN | No proof |
| a1079 | src/director/packs/session.js | 74 | guard order | known limit | m284; proposal.md |

## Failed tests

```json
{
  "m368": {
    "test": "[director-085] The position rejects negative longitude",
    "output": [
      "KILLED",
      "[director-085] The position rejects negative longitude"
    ]
  },
  "m369": {
    "test": "[director-085] The position rejects negative latitude",
    "output": [
      "KILLED",
      "[director-085] The position rejects negative latitude"
    ]
  },
  "m370": {
    "test": "[director-085] The position accepts the limit for negative longitude",
    "output": [
      "KILLED",
      "[director-085] The position accepts the limit for negative longitude"
    ]
  },
  "m371": {
    "test": "[director-085] The position accepts the limit for negative latitude",
    "output": [
      "KILLED",
      "[director-085] The position accepts the limit for negative latitude"
    ]
  },
  "m372": {
    "test": "[director-085] The position rejects four coordinates",
    "output": [
      "KILLED",
      "[director-085] The position rejects four coordinates"
    ]
  },
  "m373": {
    "test": "[director-085] The position rejects one coordinate",
    "output": [
      "KILLED",
      "[director-085] The position rejects one coordinate"
    ]
  },
  "m374": {
    "test": "[director-076] The asset path rejects .x",
    "output": [
      "KILLED",
      "[director-076] The asset path rejects .x"
    ]
  },
  "m375": {
    "test": "[director-076] The asset path rejects x?a=1",
    "output": [
      "KILLED",
      "[director-076] The asset path rejects x?a=1"
    ]
  },
  "m376": {
    "test": "[director-079] The manifest accepts one byte",
    "output": [
      "KILLED",
      "[director-079] The manifest accepts one byte"
    ]
  },
  "m377": {
    "test": "[director-080] The image rejects bounds outside an array",
    "output": [
      "KILLED",
      "[director-080] The image rejects bounds outside an array"
    ]
  },
  "m378": {
    "test": "[director-082] The scene rejects nine distinct data packs",
    "output": [
      "KILLED",
      "[director-082] The scene rejects nine distinct data packs"
    ]
  },
  "m379": {
    "test": "[director-082] The scene accepts eight distinct data packs",
    "output": [
      "KILLED",
      "[director-082] The scene accepts eight distinct data packs"
    ]
  },
  "m380": {
    "test": "[director-089] The data pack session reports its state during asset work",
    "output": [
      "KILLED",
      "[director-089] The data pack session reports its state during asset work"
    ]
  },
  "m381": {
    "test": "[director-096] The directory source accepts its default byte limit",
    "output": [
      "KILLED",
      "[director-096] The directory source accepts its default byte limit"
    ]
  },
  "m382": {
    "test": "[director-098] The bundle helpers accept the character limit",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers accept the character limit"
    ]
  },
  "m383": {
    "test": "[director-098] The bundle helpers accept the multibyte text limit",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers accept the multibyte text limit"
    ]
  },
  "m384": {
    "test": "[director-098] The bundle helpers reject an invalid plain project",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers reject an invalid plain project"
    ]
  },
  "m385": {
    "test": "[director-098] The bundle helpers reject a null project",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers reject a null project"
    ]
  },
  "m386": {
    "test": "[director-099] The bundle helpers reject an extra top field",
    "output": [
      "KILLED",
      "[director-099] The bundle helpers reject an extra top field"
    ]
  },
  "m387": {
    "test": "[director-099] The bundle helpers reject an invalid bundle project",
    "output": [
      "KILLED",
      "[director-099] The bundle helpers reject an invalid bundle project"
    ]
  },
  "m388": {
    "test": "[director-099] The import accepts 64 distinct assets",
    "output": [
      "KILLED",
      "[director-099] The import accepts 64 distinct assets"
    ]
  },
  "m389": {
    "test": "[director-101] The export rejects an invalid project",
    "output": [
      "SURVIVED",
      ""
    ]
  },
  "m390": {
    "test": "[director-101] The resolver receives the data pack and signal",
    "output": [
      "KILLED",
      "[director-101] The resolver receives the data pack and signal"
    ]
  },
  "m391": {
    "test": "[director-101] The resolver receives the data pack and signal",
    "output": [
      "KILLED",
      "[director-101] The resolver receives the data pack and signal"
    ]
  },
  "m392": {
    "test": "[director-102] The export accepts the text byte limit",
    "output": [
      "KILLED",
      "[director-102] The export accepts the text byte limit"
    ]
  },
  "m393": {
    "test": "[director-105] The byte store accepts the caller byte limit",
    "output": [
      "KILLED",
      "[director-105] The byte store accepts the caller byte limit"
    ]
  },
  "m394": {
    "test": "[director-093] The renderer receives the data pack and scene anchors",
    "output": [
      "KILLED",
      "[director-093] The renderer receives the data pack and scene anchors"
    ]
  },
  "m395": {
    "test": "[director-093] The renderer receives the data pack and scene anchors",
    "output": [
      "KILLED",
      "[director-093] The renderer receives the data pack and scene anchors"
    ]
  },
  "m396": {
    "test": "[director-089] The data pack session removes source listeners after success",
    "output": [
      "KILLED",
      "[director-089] The data pack session removes source listeners after success"
    ]
  },
  "m397": {
    "test": "[director-089] The data pack session removes source listeners after success",
    "output": [
      "KILLED",
      "[director-089] The data pack session removes source listeners after success"
    ]
  },
  "m398": {
    "test": "[director-089] The data pack session removes source listeners after error",
    "output": [
      "KILLED",
      "[director-089] The data pack session removes source listeners after error"
    ]
  },
  "m399": {
    "test": "[director-079] The manifest accepts its byte limit",
    "output": [
      "KILLED",
      "[director-079] The manifest accepts its byte limit"
    ]
  },
  "m400": {
    "test": "[director-080] The image accepts its minimum height",
    "output": [
      "KILLED",
      "[director-080] The image accepts its minimum height"
    ]
  },
  "m401": {
    "test": "[director-080] The image accepts its maximum height",
    "output": [
      "KILLED",
      "[director-080] The image accepts its maximum height"
    ]
  },
  "m402": {
    "test": "[director-085] The position accepts its minimum height",
    "output": [
      "KILLED",
      "[director-085] The position accepts its minimum height"
    ]
  },
  "m403": {
    "test": "[director-085] The position accepts its maximum height",
    "output": [
      "KILLED",
      "[director-085] The position accepts its maximum height"
    ]
  },
  "m404": {
    "test": "[director-107] The share helpers remove the listener after cancel",
    "output": [
      "KILLED",
      "[director-107] The share helpers remove the listener after cancel"
    ]
  },
  "m405": {
    "test": "[director-107] The share helpers remove the listener after success",
    "output": [
      "KILLED",
      "[director-107] The share helpers remove the listener after success"
    ]
  },
  "m406": {
    "test": "[director-107] The share helpers remove the listener after error",
    "output": [
      "KILLED",
      "[director-107] The share helpers remove the listener after error"
    ]
  },
  "m407": {
    "test": "[director-107] The share helpers remove the listener after success",
    "output": [
      "KILLED",
      "[director-107] The share helpers remove the listener after success"
    ]
  },
  "m001": {
    "test": "[director-076] The asset path accepts safe names",
    "output": [
      "KILLED",
      "[director-076] The asset path accepts safe names"
    ]
  },
  "m002": {
    "test": "[director-076] The asset path rejects traversal",
    "output": [
      "KILLED",
      "[director-076] The asset path rejects traversal"
    ]
  },
  "m003": {
    "test": "[director-077] The manifest rejects invalid version",
    "output": [
      "KILLED",
      "[director-077] The manifest rejects invalid version"
    ]
  },
  "m004": {
    "test": "[director-077] The manifest rejects invalid format",
    "output": [
      "KILLED",
      "[director-077] The manifest rejects invalid format"
    ]
  },
  "m005": {
    "test": "[director-078] The attribution rejects protocol",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects protocol"
    ]
  },
  "m006": {
    "test": "[director-078] The attribution rejects username",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects username"
    ]
  },
  "m007": {
    "test": "[director-078] The attribution rejects password",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects password"
    ]
  },
  "m008": {
    "test": "[director-078] The attribution rejects query",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects query"
    ]
  },
  "m009": {
    "test": "[director-078] The attribution rejects fragment",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects fragment"
    ]
  },
  "m010": {
    "test": "[director-078] The attribution rejects invalid URL text",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects invalid URL text"
    ]
  },
  "m011": {
    "test": "[director-078] The attribution accepts a safe link",
    "output": [
      "KILLED",
      "[director-078] The attribution accepts a safe link"
    ]
  },
  "m012": {
    "test": "[director-078] The attribution rejects blank text",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects blank text"
    ]
  },
  "m013": {
    "test": "[director-078] The attribution rejects blank license",
    "output": [
      "KILLED",
      "[director-078] The attribution rejects blank license"
    ]
  },
  "m014": {
    "test": "[director-079] The byte length rejects a fraction",
    "output": [
      "KILLED",
      "[director-079] The byte length rejects a fraction"
    ]
  },
  "m015": {
    "test": "[director-079] The digest rejects invalid type",
    "output": [
      "KILLED",
      "[director-079] The digest rejects invalid type"
    ]
  },
  "m016": {
    "test": "[director-079] The digest rejects invalid alphabet",
    "output": [
      "KILLED",
      "[director-079] The digest rejects invalid alphabet"
    ]
  },
  "m017": {
    "test": "[director-079] The integrity fields accept their limits",
    "output": [
      "KILLED",
      "[director-079] The integrity fields accept their limits"
    ]
  },
  "m018": {
    "test": "[director-080] The image rejects reversed west",
    "output": [
      "KILLED",
      "[director-080] The image rejects reversed west"
    ]
  },
  "m019": {
    "test": "[director-080] The image rejects reversed south",
    "output": [
      "KILLED",
      "[director-080] The image rejects reversed south"
    ]
  },
  "m020": {
    "test": "[director-080] The image rejects short bounds",
    "output": [
      "KILLED",
      "[director-080] The image rejects short bounds"
    ]
  },
  "m021": {
    "test": "[director-080] The image rejects height and reference",
    "output": [
      "KILLED",
      "[director-080] The image rejects height and reference"
    ]
  },
  "m022": {
    "test": "[director-081] The media rejects an unknown anchor",
    "output": [
      "KILLED",
      "[director-081] The media rejects an unknown anchor"
    ]
  },
  "m023": {
    "test": "[director-082] The scene rejects duplicate data pack IDs",
    "output": [
      "KILLED",
      "[director-082] The scene rejects duplicate data pack IDs"
    ]
  },
  "m024": {
    "test": "[director-082] The shot rejects duplicate data pack IDs",
    "output": [
      "KILLED",
      "[director-082] The shot rejects duplicate data pack IDs"
    ]
  },
  "m025": {
    "test": "[director-082] The shot rejects unknown data pack IDs",
    "output": [
      "KILLED",
      "[director-082] The shot rejects unknown data pack IDs"
    ]
  },
  "m026": {
    "test": "[director-082] The scene accepts absent data packs and anchors",
    "output": [
      "KILLED",
      "[director-082] The scene accepts absent data packs and anchors"
    ]
  },
  "m027": {
    "test": "[director-083] The collection rejects invalid type",
    "output": [
      "KILLED",
      "[director-083] The collection rejects invalid type"
    ]
  },
  "m028": {
    "test": "[director-083] The collection rejects invalid array",
    "output": [
      "KILLED",
      "[director-083] The collection rejects invalid array"
    ]
  },
  "m029": {
    "test": "[director-083] The collection rejects more than 2000 features",
    "output": [
      "KILLED",
      "[director-083] The collection rejects more than 2000 features"
    ]
  },
  "m030": {
    "test": "[director-084] The feature rejects type",
    "output": [
      "KILLED",
      "[director-084] The feature rejects type"
    ]
  },
  "m031": {
    "test": "[director-084] The feature rejects ID type",
    "output": [
      "KILLED",
      "[director-084] The feature rejects ID type"
    ]
  },
  "m032": {
    "test": "[director-084] The feature rejects blank ID",
    "output": [
      "KILLED",
      "[director-084] The feature rejects blank ID"
    ]
  },
  "m033": {
    "test": "[director-084] The feature rejects long ID",
    "output": [
      "KILLED",
      "[director-084] The feature rejects long ID"
    ]
  },
  "m034": {
    "test": "[director-084] The feature rejects duplicate ID",
    "output": [
      "KILLED",
      "[director-084] The feature rejects duplicate ID"
    ]
  },
  "m035": {
    "test": "[director-085] The position rejects invalid array",
    "output": [
      "KILLED",
      "[director-085] The position rejects invalid array"
    ]
  },
  "m036": {
    "test": "[director-085] The position rejects invalid length",
    "output": [
      "KILLED",
      "[director-085] The position rejects invalid length"
    ]
  },
  "m037": {
    "test": "[director-085] The position rejects a coordinate that is not finite",
    "output": [
      "KILLED",
      "[director-085] The position rejects a coordinate that is not finite"
    ]
  },
  "m038": {
    "test": "[director-085] The position rejects invalid longitude",
    "output": [
      "KILLED",
      "[director-085] The position rejects invalid longitude"
    ]
  },
  "m039": {
    "test": "[director-085] The position rejects invalid latitude",
    "output": [
      "KILLED",
      "[director-085] The position rejects invalid latitude"
    ]
  },
  "m040": {
    "test": "[director-085] The position rejects a height below the limit",
    "output": [
      "KILLED",
      "[director-085] The position rejects a height below the limit"
    ]
  },
  "m041": {
    "test": "[director-085] The position rejects a height above the limit",
    "output": [
      "KILLED",
      "[director-085] The position rejects a height above the limit"
    ]
  },
  "m042": {
    "test": "[director-085] The position total rejects excess",
    "output": [
      "KILLED",
      "[director-085] The position total rejects excess"
    ]
  },
  "m043": {
    "test": "[director-085] The position uses zero for absent height",
    "output": [
      "KILLED",
      "[director-085] The position uses zero for absent height"
    ]
  },
  "m044": {
    "test": "[director-085] The position keeps the height in the data",
    "output": [
      "KILLED",
      "[director-085] The position keeps the height in the data"
    ]
  },
  "m045": {
    "test": "[director-086] The line rejects invalid array",
    "output": [
      "KILLED",
      "[director-086] The line rejects invalid array"
    ]
  },
  "m046": {
    "test": "[director-086] The line rejects invalid minimum",
    "output": [
      "KILLED",
      "[director-086] The line rejects invalid minimum"
    ]
  },
  "m047": {
    "test": "[director-086] The ring needs four points",
    "output": [
      "KILLED",
      "[director-086] The ring needs four points"
    ]
  },
  "m048": {
    "test": "[director-086] The line accepts two distinct endpoints",
    "output": [
      "KILLED",
      "[director-086] The line accepts two distinct endpoints"
    ]
  },
  "m049": {
    "test": "[director-086] The ring rejects unclosed field 0",
    "output": [
      "KILLED",
      "[director-086] The ring rejects unclosed field 0"
    ]
  },
  "m050": {
    "test": "[director-086] The ring rejects unclosed field 1",
    "output": [
      "KILLED",
      "[director-086] The ring rejects unclosed field 1"
    ]
  },
  "m051": {
    "test": "[director-086] The ring rejects unclosed field 2",
    "output": [
      "KILLED",
      "[director-086] The ring rejects unclosed field 2"
    ]
  },
  "m052": {
    "test": "[director-087] The geometry rejects invalid type",
    "output": [
      "KILLED",
      "[director-087] The geometry rejects invalid type"
    ]
  },
  "m053": {
    "test": "[director-087] The geometry rejects invalid array",
    "output": [
      "KILLED",
      "[director-087] The geometry rejects invalid array"
    ]
  },
  "m054": {
    "test": "[director-087] The geometry rejects an empty polygon",
    "output": [
      "KILLED",
      "[director-087] The geometry rejects an empty polygon"
    ]
  },
  "m055": {
    "test": "[director-087] The geometry rejects more than 128 rings",
    "output": [
      "KILLED",
      "[director-087] The geometry rejects more than 128 rings"
    ]
  },
  "m056": {
    "test": "[director-087] The geometry returns a closed polygon",
    "output": [
      "KILLED",
      "[director-087] The geometry returns a closed polygon"
    ]
  },
  "m057": {
    "test": "[director-087] The geometry removes properties",
    "output": [
      "KILLED",
      "[director-087] The geometry removes properties"
    ]
  },
  "m058": {
    "test": "[director-088] The new session reports idle state",
    "output": [
      "KILLED",
      "[director-088] The new session reports idle state"
    ]
  },
  "m059": {
    "test": "[director-088] The session rejects a value that is not a data pack list",
    "output": [
      "KILLED",
      "[director-088] The session rejects a value that is not a data pack list"
    ]
  },
  "m060": {
    "test": "[director-088] The session rejects more than eight data packs",
    "output": [
      "KILLED",
      "[director-088] The session rejects more than eight data packs"
    ]
  },
  "m061": {
    "test": "[director-088] The session rejects destroyed state",
    "output": [
      "KILLED",
      "[director-088] The session rejects destroyed state"
    ]
  },
  "m062": {
    "test": "[director-088] The session rejects cancelled state",
    "output": [
      "KILLED",
      "[director-088] The session rejects cancelled state"
    ]
  },
  "m063": {
    "test": "[director-089] The session disposes handles in reverse order",
    "output": [
      "KILLED",
      "[director-089] The session disposes handles in reverse order"
    ]
  },
  "m064": {
    "test": "[director-089] The session gives copied state",
    "output": [
      "KILLED",
      "[director-089] The session gives copied state"
    ]
  },
  "m065": {
    "test": "[director-090] The cancelled session disposes late resources",
    "output": [
      "KILLED",
      "[director-090] The cancelled session disposes late resources"
    ]
  },
  "m066": {
    "test": "[director-090] The session accepts a null late handle",
    "output": [
      "KILLED",
      "[director-090] The session accepts a null late handle"
    ]
  },
  "m067": {
    "test": "[director-090] The session destroys work that is not complete",
    "output": [
      "KILLED",
      "[director-090] The session destroys work that is not complete"
    ]
  },
  "m068": {
    "test": "[director-091] The replacement keeps its resources",
    "output": [
      "KILLED",
      "[director-091] The replacement keeps its resources"
    ]
  },
  "m069": {
    "test": "[director-092] The session reports a stable source error",
    "output": [
      "KILLED",
      "[director-092] The session reports a stable source error"
    ]
  },
  "m070": {
    "test": "[director-092] The deadline rejects stalled work",
    "output": [
      "KILLED",
      "[director-092] The deadline rejects stalled work"
    ]
  },
  "m071": {
    "test": "[director-092] The data pack session reads the byteLength field once without a registered source",
    "output": [
      "KILLED",
      "[director-092] The data pack session reads the byteLength field once without a registered source"
    ]
  },
  "m072": {
    "test": "[director-092] The absent renderer does not call its source",
    "output": [
      "KILLED",
      "[director-092] The absent renderer does not call its source"
    ]
  },
  "m073": {
    "test": "[director-093] The session rejects bytes that are not a Uint8Array",
    "output": [
      "KILLED",
      "[director-093] The session rejects bytes that are not a Uint8Array"
    ]
  },
  "m074": {
    "test": "[director-093] The session rejects an empty asset",
    "output": [
      "KILLED",
      "[director-093] The session rejects an empty asset"
    ]
  },
  "m075": {
    "test": "[director-093] The session rejects an asset above the byte limit",
    "output": [
      "KILLED",
      "[director-093] The session rejects an asset above the byte limit"
    ]
  },
  "m076": {
    "test": "[director-093] The session rejects a wrong byteLength field",
    "output": [
      "KILLED",
      "[director-093] The session rejects a wrong byteLength field"
    ]
  },
  "m077": {
    "test": "[director-093] The session rejects bytes above the total limit",
    "output": [
      "KILLED",
      "[director-093] The session rejects bytes above the total limit"
    ]
  },
  "m078": {
    "test": "[director-093] The session rejects a wrong digest",
    "output": [
      "KILLED",
      "[director-093] The session rejects a wrong digest"
    ]
  },
  "m079": {
    "test": "[director-093] The session checks exact bytes and digest",
    "output": [
      "KILLED",
      "[director-093] The session checks exact bytes and digest"
    ]
  },
  "m080": {
    "test": "[director-089] The session rejects a falsy handle with inherited disposal",
    "output": [
      "KILLED",
      "[director-089] The session rejects a falsy handle with inherited disposal"
    ]
  },
  "m081": {
    "test": "[director-089] The session rejects a handle without a dispose function",
    "output": [
      "KILLED",
      "[director-089] The session rejects a handle without a dispose function"
    ]
  },
  "m082": {
    "test": "[director-094] The directory rejects protocol",
    "output": [
      "KILLED",
      "[director-094] The directory rejects protocol"
    ]
  },
  "m083": {
    "test": "[director-094] The directory rejects username",
    "output": [
      "KILLED",
      "[director-094] The directory rejects username"
    ]
  },
  "m084": {
    "test": "[director-094] The directory rejects password",
    "output": [
      "KILLED",
      "[director-094] The directory rejects password"
    ]
  },
  "m085": {
    "test": "[director-094] The directory rejects query",
    "output": [
      "KILLED",
      "[director-094] The directory rejects query"
    ]
  },
  "m086": {
    "test": "[director-094] The directory rejects fragment",
    "output": [
      "KILLED",
      "[director-094] The directory rejects fragment"
    ]
  },
  "m087": {
    "test": "[director-094] The directory rejects an address with no final slash",
    "output": [
      "KILLED",
      "[director-094] The directory rejects an address with no final slash"
    ]
  },
  "m088": {
    "test": "[director-095] The asset request sets its fixed options",
    "output": [
      "KILLED",
      "[director-095] The asset request sets its fixed options"
    ]
  },
  "m089": {
    "test": "[director-096] The stream joins distinct chunks",
    "output": [
      "KILLED",
      "[director-096] The stream joins distinct chunks"
    ]
  },
  "m090": {
    "test": "[director-096] The stream rejects excess header bytes",
    "output": [
      "KILLED",
      "[director-096] The stream rejects excess header bytes"
    ]
  },
  "m091": {
    "test": "[director-096] The stream rejects excess chunk bytes",
    "output": [
      "KILLED",
      "[director-096] The stream rejects excess chunk bytes"
    ]
  },
  "m092": {
    "test": "[director-096] The stream uses absent MIME default",
    "output": [
      "KILLED",
      "[director-096] The stream uses absent MIME default"
    ]
  },
  "m093": {
    "test": "[director-096] The stream normalizes MIME text",
    "output": [
      "KILLED",
      "[director-096] The stream normalizes MIME text"
    ]
  },
  "m094": {
    "test": "[director-097] The source rejects an absent stream",
    "output": [
      "KILLED",
      "[director-097] The source rejects an absent stream"
    ]
  },
  "m095": {
    "test": "[director-097] The source accepts failed body cancellation",
    "output": [
      "KILLED",
      "[director-097] The source accepts failed body cancellation"
    ]
  },
  "m096": {
    "test": "[director-097] The source rejects a failed response without a body",
    "output": [
      "KILLED",
      "[director-097] The source rejects a failed response without a body"
    ]
  },
  "m097": {
    "test": "[director-097] The stream releases its lock after an error",
    "output": [
      "KILLED",
      "[director-097] The stream releases its lock after an error"
    ]
  },
  "m098": {
    "test": "[director-097] The source checks its signal between chunks",
    "output": [
      "KILLED",
      "[director-097] The source checks its signal between chunks"
    ]
  },
  "m099": {
    "test": "[director-098] The bundle helpers reject nontext input",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers reject nontext input"
    ]
  },
  "m100": {
    "test": "[director-098] The bundle helpers reject invalid JSON",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers reject invalid JSON"
    ]
  },
  "m101": {
    "test": "[director-098] The bundle helpers accept plain project JSON",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers accept plain project JSON"
    ]
  },
  "m102": {
    "test": "[director-098] The bundle helpers reject excess characters",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers reject excess characters"
    ]
  },
  "m103": {
    "test": "[director-098] The bundle helpers reject excess UTF8 bytes",
    "output": [
      "KILLED",
      "[director-098] The bundle helpers reject excess UTF8 bytes"
    ]
  },
  "m104": {
    "test": "[director-099] The base64 rejects a custom text object",
    "output": [
      "KILLED",
      "[director-099] The base64 rejects a custom text object"
    ]
  },
  "m105": {
    "test": "[director-099] The base64 rejects invalid empty",
    "output": [
      "KILLED",
      "[director-099] The base64 rejects invalid empty"
    ]
  },
  "m106": {
    "test": "[director-099] The base64 rejects invalid length",
    "output": [
      "KILLED",
      "[director-099] The base64 rejects invalid length"
    ]
  },
  "m107": {
    "test": "[director-099] The base64 rejects invalid alignment",
    "output": [
      "KILLED",
      "[director-099] The base64 rejects invalid alignment"
    ]
  },
  "m108": {
    "test": "[director-099] The base64 rejects invalid alphabet",
    "output": [
      "KILLED",
      "[director-099] The base64 rejects invalid alphabet"
    ]
  },
  "m109": {
    "test": "[director-099] The base64 rejects invalid padding",
    "output": [
      "KILLED",
      "[director-099] The base64 rejects invalid padding"
    ]
  },
  "m110": {
    "test": "[director-099] The bundle rejects duplicate paths",
    "output": [
      "KILLED",
      "[director-099] The bundle rejects duplicate paths"
    ]
  },
  "m111": {
    "test": "[director-099] The bundle rejects unsupported MIME",
    "output": [
      "KILLED",
      "[director-099] The bundle rejects unsupported MIME"
    ]
  },
  "m112": {
    "test": "[director-099] The bundle rejects unsupported version",
    "output": [
      "KILLED",
      "[director-099] The bundle rejects unsupported version"
    ]
  },
  "m113": {
    "test": "[director-100] The bundle rejects an absent asset",
    "output": [
      "KILLED",
      "[director-100] The bundle rejects an absent asset"
    ]
  },
  "m114": {
    "test": "[director-100] The bundle rejects a wrong byteLength field",
    "output": [
      "KILLED",
      "[director-100] The bundle rejects a wrong byteLength field"
    ]
  },
  "m115": {
    "test": "[director-100] The bundle rejects a pack digest that differs from its asset",
    "output": [
      "KILLED",
      "[director-100] The bundle rejects a pack digest that differs from its asset"
    ]
  },
  "m116": {
    "test": "[director-100] The bundle rejects an asset digest that differs from its bytes",
    "output": [
      "KILLED",
      "[director-100] The bundle rejects an asset digest that differs from its bytes"
    ]
  },
  "m117": {
    "test": "[director-100] The bundle rejects unused assets",
    "output": [
      "KILLED",
      "[director-100] The bundle rejects unused assets"
    ]
  },
  "m118": {
    "test": "[director-100] The bundle rejects external data pack sources",
    "output": [
      "KILLED",
      "[director-100] The bundle rejects external data pack sources"
    ]
  },
  "m119": {
    "test": "[director-101] The export writes exact bundle metadata",
    "output": [
      "KILLED",
      "[director-101] The export writes exact bundle metadata"
    ]
  },
  "m120": {
    "test": "[director-102] The export rejects bytes that are not a Uint8Array",
    "output": [
      "KILLED",
      "[director-102] The export rejects bytes that are not a Uint8Array"
    ]
  },
  "m121": {
    "test": "[director-102] The export rejects an empty asset",
    "output": [
      "KILLED",
      "[director-102] The export rejects an empty asset"
    ]
  },
  "m122": {
    "test": "[director-102] The export rejects an asset above the byte limit",
    "output": [
      "KILLED",
      "[director-102] The export rejects an asset above the byte limit"
    ]
  },
  "m123": {
    "test": "[director-102] The export rejects absent assets",
    "output": [
      "KILLED",
      "[director-102] The export rejects absent assets"
    ]
  },
  "m124": {
    "test": "[director-102] The export rejects declared byte length",
    "output": [
      "KILLED",
      "[director-102] The export rejects declared byte length"
    ]
  },
  "m125": {
    "test": "[director-102] The export rejects declared digest",
    "output": [
      "KILLED",
      "[director-102] The export rejects declared digest"
    ]
  },
  "m126": {
    "test": "[director-102] The export rejects excess total bytes",
    "output": [
      "KILLED",
      "[director-102] The export rejects excess total bytes"
    ]
  },
  "m127": {
    "test": "[director-102] The export rejects excess asset total",
    "output": [
      "KILLED",
      "[director-102] The export rejects excess asset total"
    ]
  },
  "m128": {
    "test": "[director-103] The export reuses a shared asset",
    "output": [
      "KILLED",
      "[director-103] The export reuses a shared asset"
    ]
  },
  "m129": {
    "test": "[director-103] The export rejects shared byte length",
    "output": [
      "KILLED",
      "[director-103] The export rejects shared byte length"
    ]
  },
  "m130": {
    "test": "[director-103] The export rejects shared digest",
    "output": [
      "KILLED",
      "[director-103] The export rejects shared digest"
    ]
  },
  "m131": {
    "test": "[director-104] The store copies the asset map",
    "output": [
      "KILLED",
      "[director-104] The store copies the asset map"
    ]
  },
  "m132": {
    "test": "[director-104] The store clears stored bytes",
    "output": [
      "KILLED",
      "[director-104] The store clears stored bytes"
    ]
  },
  "m133": {
    "test": "[director-105] The store rejects absent bytes",
    "output": [
      "KILLED",
      "[director-105] The store rejects absent bytes"
    ]
  },
  "m134": {
    "test": "[director-105] The store rejects bytes above the caller limit",
    "output": [
      "KILLED",
      "[director-105] The store rejects bytes above the caller limit"
    ]
  },
  "m135": {
    "test": "[director-105] The store returns an independent byte copy",
    "output": [
      "KILLED",
      "[director-105] The store returns an independent byte copy"
    ]
  },
  "m136": {
    "test": "[director-106] The share helpers accept an absent filename",
    "output": [
      "KILLED",
      "[director-106] The share helpers accept an absent filename"
    ]
  },
  "m137": {
    "test": "[director-106] The share helpers reject the ordinary file budget",
    "output": [
      "KILLED",
      "[director-106] The share helpers reject the ordinary file budget"
    ]
  },
  "m138": {
    "test": "[director-106] The share helpers give bundles the larger budget",
    "output": [
      "KILLED",
      "[director-106] The share helpers give bundles the larger budget"
    ]
  },
  "m139": {
    "test": "[director-107] The helper resolves without a signal",
    "output": [
      "KILLED",
      "[director-107] The helper resolves without a signal"
    ]
  },
  "m140": {
    "test": "[director-107] The helper rejects an early signal",
    "output": [
      "KILLED",
      "[director-107] The helper rejects an early signal"
    ]
  },
  "m141": {
    "test": "[director-107] The helper resolves with an active signal",
    "output": [
      "KILLED",
      "[director-107] The helper resolves with an active signal"
    ]
  },
  "m142": {
    "test": "[director-107] The helper rejects a work error",
    "output": [
      "KILLED",
      "[director-107] The helper rejects a work error"
    ]
  },
  "m143": {
    "test": "[director-107] The helper checks signal state at settlement",
    "output": [
      "KILLED",
      "[director-107] The helper checks signal state at settlement"
    ]
  },
  "m144": {
    "test": "[director-107] The helper cancels work that is not complete",
    "output": [
      "KILLED",
      "[director-107] The helper cancels work that is not complete"
    ]
  },
  "m145": {
    "test": "[director-108] The preview reports exact totals and attribution",
    "output": [
      "KILLED",
      "[director-108] The preview reports exact totals and attribution"
    ]
  },
  "m146": {
    "test": "[director-108] The preview uses the scene ID without a title",
    "output": [
      "KILLED",
      "[director-108] The preview uses the scene ID without a title"
    ]
  },
  "m147": {
    "test": "[director-109] The preview reports included bundle bytes",
    "output": [
      "KILLED",
      "[director-109] The preview reports included bundle bytes"
    ]
  },
  "m148": {
    "test": "[director-109] The preview reports absent bundle bytes",
    "output": [
      "KILLED",
      "[director-109] The preview reports absent bundle bytes"
    ]
  },
  "m149": {
    "test": "[director-109] The preview reports a configured source",
    "output": [
      "KILLED",
      "[director-109] The preview reports a configured source"
    ]
  },
  "m150": {
    "test": "[director-109] The preview reports an unavailable source",
    "output": [
      "KILLED",
      "[director-109] The preview reports an unavailable source"
    ]
  },
  "m151": {
    "test": "[director-110] The preview lists distinct absent layers",
    "output": [
      "KILLED",
      "[director-110] The preview lists distinct absent layers"
    ]
  },
  "m152": {
    "test": "[director-110] The preview detects applied shot packs",
    "output": [
      "KILLED",
      "[director-110] The preview detects applied shot packs"
    ]
  },
  "m153": {
    "test": "[director-110] The preview detects the source pack ID of a shot",
    "output": [
      "KILLED",
      "[director-110] The preview detects the source pack ID of a shot"
    ]
  },
  "m154": {
    "test": "[director-110] The preview detects no external content",
    "output": [
      "KILLED",
      "[director-110] The preview detects no external content"
    ]
  },
  "m155": {
    "test": "[director-080] The image accepts its bounds field",
    "output": [
      "KILLED",
      "[director-080] The image accepts its bounds field"
    ]
  },
  "m156": {
    "test": "[director-080] The image accepts its height field",
    "output": [
      "KILLED",
      "[director-080] The image accepts its height field"
    ]
  },
  "m157": {
    "test": "[director-080] The image accepts its altitudeReference field",
    "output": [
      "KILLED",
      "[director-080] The image accepts its altitudeReference field"
    ]
  },
  "m158": {
    "test": "[director-081] The media accepts its anchorId field",
    "output": [
      "KILLED",
      "[director-081] The media accepts its anchorId field"
    ]
  },
  "m159": {
    "test": "[director-077] The geojson accepts its altitudeReference field",
    "output": [
      "KILLED",
      "[director-077] The geojson accepts its altitudeReference field"
    ]
  },
  "m160": {
    "test": "[director-080] The image bounds 0 rejects low excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 0 rejects low excess"
    ]
  },
  "m161": {
    "test": "[director-080] The image bounds 0 rejects high excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 0 rejects high excess"
    ]
  },
  "m162": {
    "test": "[director-080] The image bounds 1 rejects low excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 1 rejects low excess"
    ]
  },
  "m163": {
    "test": "[director-080] The image bounds 1 rejects high excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 1 rejects high excess"
    ]
  },
  "m164": {
    "test": "[director-080] The image bounds 2 rejects low excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 2 rejects low excess"
    ]
  },
  "m165": {
    "test": "[director-080] The image bounds 2 rejects high excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 2 rejects high excess"
    ]
  },
  "m166": {
    "test": "[director-080] The image bounds 3 rejects low excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 3 rejects low excess"
    ]
  },
  "m167": {
    "test": "[director-080] The image bounds 3 rejects high excess",
    "output": [
      "KILLED",
      "[director-080] The image bounds 3 rejects high excess"
    ]
  },
  "m168": {
    "test": "[director-080] The image height checks both limits",
    "output": [
      "KILLED",
      "[director-080] The image height checks both limits"
    ]
  },
  "m169": {
    "test": "[director-082] The scene uses supplied anchors",
    "output": [
      "KILLED",
      "[director-082] The scene uses supplied anchors"
    ]
  },
  "m170": {
    "test": "[director-082] The scene uses absent anchor defaults",
    "output": [
      "KILLED",
      "[director-082] The scene uses absent anchor defaults"
    ]
  },
  "m171": {
    "test": "[director-085] The position accepts both geographic edges",
    "output": [
      "KILLED",
      "[director-085] The position accepts both geographic edges"
    ]
  },
  "m172": {
    "test": "Repository tests of the code limit",
    "output": [
      "SURVIVED",
      ""
    ]
  },
  "m173": {
    "test": "[director-088] The session state uses its idle default",
    "output": [
      "KILLED",
      "[director-088] The session state uses its idle default"
    ]
  },
  "m174": {
    "test": "[director-088] The session state uses its zero default",
    "output": [
      "KILLED",
      "[director-088] The session state uses its zero default"
    ]
  },
  "m175": {
    "test": "[director-089] The session state uses its active total",
    "output": [
      "KILLED",
      "[director-089] The session state uses its active total"
    ]
  },
  "m176": {
    "test": "[director-093] The session uses its default byte budget",
    "output": [
      "KILLED",
      "[director-093] The session uses its default byte budget"
    ]
  },
  "m177": {
    "test": "[director-093] The session accepts absent declared size",
    "output": [
      "KILLED",
      "[director-093] The session accepts absent declared size"
    ]
  },
  "m178": {
    "test": "[director-090] The session checks signal state without an event",
    "output": [
      "KILLED",
      "[director-090] The session checks signal state without an event"
    ]
  },
  "m179": {
    "test": "[director-090] The session checks destroyed state after signal access",
    "output": [
      "KILLED",
      "[director-090] The session checks destroyed state after signal access"
    ]
  },
  "m180": {
    "test": "[director-090] The session checks replacement without signal state",
    "output": [
      "KILLED",
      "[director-090] The session checks replacement without signal state"
    ]
  },
  "m181": {
    "test": "[director-090] The session guard rejects a detached resource",
    "output": [
      "KILLED",
      "[director-090] The session guard rejects a detached resource"
    ]
  },
  "m182": {
    "test": "[director-090] The session disposes the handle before it adds the handle to its list",
    "output": [
      "KILLED",
      "[director-090] The session disposes the handle before it adds the handle to its list"
    ]
  },
  "m183": {
    "test": "[director-092] The session settles a source error before its deadline",
    "output": [
      "KILLED",
      "[director-092] The session settles a source error before its deadline"
    ]
  },
  "m184": {
    "test": "[director-097] The source rejects early cancellation",
    "output": [
      "KILLED",
      "[director-097] The source rejects early cancellation"
    ]
  },
  "m185": {
    "test": "[director-094] The directory accepts HTTP and HTTPS",
    "output": [
      "KILLED",
      "[director-094] The directory accepts HTTP and HTTPS"
    ]
  },
  "m186": {
    "test": "[director-098] The share character guard precedes byte conversion",
    "output": [
      "KILLED",
      "[director-098] The share character guard precedes byte conversion"
    ]
  },
  "m187": {
    "test": "[director-101] The export accepts scenes without data packs",
    "output": [
      "KILLED",
      "[director-101] The export accepts scenes without data packs"
    ]
  },
  "m188": {
    "test": "[director-101] The export keeps a supplied data pack list",
    "output": [
      "KILLED",
      "[director-101] The export keeps a supplied data pack list"
    ]
  },
  "m189": {
    "test": "[director-102] The export accepts absent integrity fields",
    "output": [
      "KILLED",
      "[director-102] The export accepts absent integrity fields"
    ]
  },
  "m190": {
    "test": "[director-102] The export accepts an absent digest",
    "output": [
      "KILLED",
      "[director-102] The export accepts an absent digest"
    ]
  },
  "m191": {
    "test": "[director-103] The shared export accepts absent byte declarations",
    "output": [
      "KILLED",
      "[director-103] The shared export accepts absent byte declarations"
    ]
  },
  "m192": {
    "test": "[director-103] The shared export accepts an absent digest",
    "output": [
      "KILLED",
      "[director-103] The shared export accepts an absent digest"
    ]
  },
  "m193": {
    "test": "[director-099] The base64 accepts bytes without padding",
    "output": [
      "KILLED",
      "[director-099] The base64 accepts bytes without padding"
    ]
  },
  "m194": {
    "test": "[director-108] The preview accepts absent data pack lists",
    "output": [
      "KILLED",
      "[director-108] The preview accepts absent data pack lists"
    ]
  },
  "m195": {
    "test": "[director-108] The preview uses supplied data pack lists",
    "output": [
      "KILLED",
      "[director-108] The preview uses supplied data pack lists"
    ]
  },
  "m196": {
    "test": "[director-108] The preview keeps a supplied scene title",
    "output": [
      "KILLED",
      "[director-108] The preview keeps a supplied scene title"
    ]
  },
  "m197": {
    "test": "[director-109] The preview distinguishes bundle sources",
    "output": [
      "KILLED",
      "[director-109] The preview distinguishes bundle sources"
    ]
  },
  "m198": {
    "test": "[director-110] The preview accepts absent shot layers",
    "output": [
      "KILLED",
      "[director-110] The preview accepts absent shot layers"
    ]
  },
  "m199": {
    "test": "[director-110] The preview uses supplied shot layers",
    "output": [
      "KILLED",
      "[director-110] The preview uses supplied shot layers"
    ]
  },
  "m200": {
    "test": "[director-105] The store checks its default byte budget",
    "output": [
      "KILLED",
      "[director-105] The store checks its default byte budget"
    ]
  },
  "m201": {
    "test": "[director-092] The absent renderer does not call its source",
    "output": [
      "KILLED",
      "[director-092] The absent renderer does not call its source"
    ]
  },
  "m202": {
    "test": "[director-099] The base64 rejects a custom text object",
    "output": [
      "KILLED",
      "[director-099] The base64 rejects a custom text object"
    ]
  },
  "m203": {
    "test": "[director-103] The export key uses the registered source name",
    "output": [
      "KILLED",
      "[director-103] The export key uses the registered source name"
    ]
  },
  "m204": {
    "test": "[director-103] The export key uses path",
    "output": [
      "KILLED",
      "[director-103] The export key uses path"
    ]
  },
  "m205": {
    "test": "[director-110] The preview detects each layer key",
    "output": [
      "KILLED",
      "[director-110] The preview detects each layer key"
    ]
  },
  "m206": {
    "test": "[director-108] The preview totals include every asset",
    "output": [
      "KILLED",
      "[director-108] The preview totals include every asset"
    ]
  },
  "m207": {
    "test": "[director-095] The asset request sets its credentials option",
    "output": [
      "KILLED",
      "[director-095] The asset request sets its credentials option"
    ]
  },
  "m208": {
    "test": "[director-095] The asset request sets its redirect option",
    "output": [
      "KILLED",
      "[director-095] The asset request sets its redirect option"
    ]
  },
  "m209": {
    "test": "[director-095] The asset request sets its referrerPolicy option",
    "output": [
      "KILLED",
      "[director-095] The asset request sets its referrerPolicy option"
    ]
  },
  "m210": {
    "test": "[director-095] The asset request sets its cache option",
    "output": [
      "KILLED",
      "[director-095] The asset request sets its cache option"
    ]
  },
  "m211": {
    "test": "[director-085] The position rejects field 0 that is not finite",
    "output": [
      "KILLED",
      "[director-085] The position rejects field 0 that is not finite"
    ]
  },
  "m212": {
    "test": "[director-085] The position rejects field 1 that is not finite",
    "output": [
      "KILLED",
      "[director-085] The position rejects field 1 that is not finite"
    ]
  },
  "m213": {
    "test": "[director-085] The position rejects field 2 that is not finite",
    "output": [
      "KILLED",
      "[director-085] The position rejects field 2 that is not finite"
    ]
  },
  "m214": {
    "test": "[director-096] The source checks its default byte budget",
    "output": [
      "KILLED",
      "[director-096] The source checks its default byte budget"
    ]
  },
  "m215": {
    "test": "[director-077] The manifest accepts the id field of a data pack",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts the id field of a data pack"
    ]
  },
  "m216": {
    "test": "[director-077] The manifest accepts the version field of a data pack",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts the version field of a data pack"
    ]
  },
  "m217": {
    "test": "[director-077] The manifest accepts the format field of a data pack",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts the format field of a data pack"
    ]
  },
  "m218": {
    "test": "[director-077] The manifest accepts the source field of a data pack",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts the source field of a data pack"
    ]
  },
  "m219": {
    "test": "[director-077] The manifest accepts the attribution field of a data pack",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts the attribution field of a data pack"
    ]
  },
  "m220": {
    "test": "[director-077] The manifest accepts the placement field of a data pack",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts the placement field of a data pack"
    ]
  },
  "m221": {
    "test": "[director-079] The manifest accepts the byteLength field of a data pack",
    "output": [
      "KILLED",
      "[director-079] The manifest accepts the byteLength field of a data pack"
    ]
  },
  "m222": {
    "test": "[director-079] The manifest accepts the sha256 field of a data pack",
    "output": [
      "KILLED",
      "[director-079] The manifest accepts the sha256 field of a data pack"
    ]
  },
  "m223": {
    "test": "[director-077] The manifest accepts its source name field",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts its source name field"
    ]
  },
  "m224": {
    "test": "[director-077] The manifest accepts its source path field",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts its source path field"
    ]
  },
  "m225": {
    "test": "[director-078] The manifest accepts its attribution text field",
    "output": [
      "KILLED",
      "[director-078] The manifest accepts its attribution text field"
    ]
  },
  "m226": {
    "test": "[director-078] The manifest accepts its attribution license field",
    "output": [
      "KILLED",
      "[director-078] The manifest accepts its attribution license field"
    ]
  },
  "m227": {
    "test": "[director-078] The manifest accepts its attribution url field",
    "output": [
      "KILLED",
      "[director-078] The manifest accepts its attribution url field"
    ]
  },
  "m228": {
    "test": "[director-100] The bundle checks its second asset reference",
    "output": [
      "KILLED",
      "[director-100] The bundle checks its second asset reference"
    ]
  },
  "m229": {
    "test": "[director-100] The bundle checks its second asset digest",
    "output": [
      "KILLED",
      "[director-100] The bundle checks its second asset digest"
    ]
  },
  "m230": {
    "test": "[director-103] The export accepts equal shared integrity",
    "output": [
      "KILLED",
      "[director-103] The export accepts equal shared integrity"
    ]
  },
  "m231": {
    "test": "[director-102] The export rejects absent asset bytes",
    "output": [
      "KILLED",
      "[director-102] The export rejects absent asset bytes"
    ]
  },
  "m232": {
    "test": "[director-092] The session settles an early internal signal",
    "output": [
      "KILLED",
      "[director-092] The session settles an early internal signal"
    ]
  },
  "m233": {
    "test": "[director-093] The session gives anchors to its renderer",
    "output": [
      "KILLED",
      "[director-093] The session gives anchors to its renderer"
    ]
  },
  "m234": {
    "test": "[director-106] The share helpers check a signal after text access",
    "output": [
      "KILLED",
      "[director-106] The share helpers check a signal after text access"
    ]
  },
  "m235": {
    "test": "[director-102] The export checks its encoded text budget",
    "output": [
      "KILLED",
      "[director-102] The export checks its encoded text budget"
    ]
  },
  "m236": {
    "test": "[director-102] The export keeps its total after an absent length",
    "output": [
      "KILLED",
      "[director-102] The export keeps its total after an absent length"
    ]
  },
  "m237": {
    "test": "[director-089] The session state uses its active status",
    "output": [
      "KILLED",
      "[director-089] The session state uses its active status"
    ]
  },
  "m238": {
    "test": "[director-080] The placement selects the image fields",
    "output": [
      "KILLED",
      "[director-080] The placement selects the image fields"
    ]
  },
  "m239": {
    "test": "[director-081] The placement selects the media fields",
    "output": [
      "KILLED",
      "[director-081] The placement selects the media fields"
    ]
  },
  "m240": {
    "test": "[director-089] The session loads its geojson format",
    "output": [
      "KILLED",
      "[director-089] The session loads its geojson format"
    ]
  },
  "m241": {
    "test": "[director-089] The session loads its image format",
    "output": [
      "KILLED",
      "[director-089] The session loads its image format"
    ]
  },
  "m242": {
    "test": "[director-089] The session loads its media format",
    "output": [
      "KILLED",
      "[director-089] The session loads its media format"
    ]
  },
  "m243": {
    "test": "[director-097] The source stops between stream chunks",
    "output": [
      "KILLED",
      "[director-097] The source stops between stream chunks"
    ]
  },
  "m244": {
    "test": "[director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and credentials",
    "output": [
      "KILLED",
      "[director-082] The manifest rejects duplicate IDs, unknown IDs, wrong placement, URL syntax and cred"
    ]
  },
  "m245": {
    "test": "[director-080] The manifest checks given image bounds and media anchor references",
    "output": [
      "KILLED",
      "[director-080] The manifest checks given image bounds and media anchor references"
    ]
  },
  "m246": {
    "test": "[director-095 director-096 director-097] The directory source sends no credentials and rejects unsafe paths, redirects, excess bytes and absent assets",
    "output": [
      "KILLED",
      "[director-095 director-096 director-097] The directory source sends no credentials and rejects unsaf"
    ]
  },
  "m247": {
    "test": "[director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints",
    "output": [
      "KILLED",
      "[director-087] GeoJSON keeps stable geometry IDs without properties or remote style hints"
    ]
  },
  "m248": {
    "test": "[director-089] The data pack session removes resources and cancels the transport on Stop",
    "output": [
      "KILLED",
      "[director-089] The data pack session removes resources and cancels the transport on Stop"
    ]
  },
  "m249": {
    "test": "[director-091] The data pack session replaces source work and ignores its late bytes",
    "output": [
      "KILLED",
      "[director-091] The data pack session replaces source work and ignores its late bytes"
    ]
  },
  "m250": {
    "test": "[director-090] The data pack session disposes late renderer resources after cancellation and keeps the replacement",
    "output": [
      "KILLED",
      "[director-090] The data pack session disposes late renderer resources after cancellation and keeps t"
    ]
  },
  "m251": {
    "test": "[director-090] The data pack session disposes a renderer resource when its signal stops after the renderer result",
    "output": [
      "KILLED",
      "[director-090] The data pack session disposes a renderer resource when its signal stops after the re"
    ]
  },
  "m252": {
    "test": "[director-092] The deadline stops a stalled registered source and a data pack error removes earlier resources",
    "output": [
      "KILLED",
      "[director-092] The deadline stops a stalled registered source and a data pack error removes earlier "
    ]
  },
  "m253": {
    "test": "[director-093] The data pack session checks bytes and integrity before the renderer call and rejects inherited registered source names",
    "output": [
      "KILLED",
      "[director-093] The data pack session checks bytes and integrity before the renderer call and rejects"
    ]
  },
  "m254": {
    "test": "[director-097] The directory source cancels response bodies and sends no asset request with a cancelled signal",
    "output": [
      "KILLED",
      "[director-097] The directory source cancels response bodies and sends no asset request with a cancel"
    ]
  },
  "m255": {
    "test": "[director-101] The selected scene bundle copies bytes and attribution and keeps the project without an asset request",
    "output": [
      "KILLED",
      "[director-101] The selected scene bundle copies bytes and attribution and keeps the project without "
    ]
  },
  "m256": {
    "test": "[director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent assets and wrong integrity",
    "output": [
      "KILLED",
      "[director-099] The bundle rejects invalid bytes, unknown fields, traversal, duplicates, absent asset"
    ]
  },
  "m257": {
    "test": "[director-102] The bundle checks asset limits and declared integrity before export",
    "output": [
      "KILLED",
      "[director-102] The bundle checks asset limits and declared integrity before export"
    ]
  },
  "m258": {
    "test": "[director-103] The data packs with the same path share one asset and reject integrity values that differ",
    "output": [
      "KILLED",
      "[director-103] The data packs with the same path share one asset and reject integrity values that di"
    ]
  },
  "m259": {
    "test": "[director-109] The preview reports unavailable sources, absent layers and absent bundle assets without state changes",
    "output": [
      "KILLED",
      "[director-109] The preview reports unavailable sources, absent layers and absent bundle assets witho"
    ]
  },
  "m260": {
    "test": "[director-104] The bundle byte store removes old data after replacement and uses no network source",
    "output": [
      "KILLED",
      "[director-104] The bundle byte store removes old data after replacement and uses no network source"
    ]
  },
  "m261": {
    "test": "[director-106] The share helpers reject excess file bytes before text access and cancel a stalled project file",
    "output": [
      "KILLED",
      "[director-106] The share helpers reject excess file bytes before text access and cancel a stalled pr"
    ]
  },
  "m262": {
    "test": "[director-107] The cancelled bundle export stops before the next asset and returns no partial output",
    "output": [
      "KILLED",
      "[director-107] The cancelled bundle export stops before the next asset and returns no partial output"
    ]
  },
  "m263": {
    "test": "[director-101] The bundle accepts long valid source asset names",
    "output": [
      "KILLED",
      "[director-101] The bundle accepts long valid source asset names"
    ]
  },
  "m264": {
    "test": "[director-077] The manifest accepts geojson",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts geojson"
    ]
  },
  "m265": {
    "test": "[director-077] The manifest accepts image",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts image"
    ]
  },
  "m266": {
    "test": "[director-077] The manifest accepts media",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts media"
    ]
  },
  "m267": {
    "test": "[director-080] The image rejects bounds field 0",
    "output": [
      "KILLED",
      "[director-080] The image rejects bounds field 0"
    ]
  },
  "m268": {
    "test": "[director-080] The image rejects bounds field 1",
    "output": [
      "KILLED",
      "[director-080] The image rejects bounds field 1"
    ]
  },
  "m269": {
    "test": "[director-080] The image rejects bounds field 2",
    "output": [
      "KILLED",
      "[director-080] The image rejects bounds field 2"
    ]
  },
  "m270": {
    "test": "[director-080] The image rejects bounds field 3",
    "output": [
      "KILLED",
      "[director-080] The image rejects bounds field 3"
    ]
  },
  "m271": {
    "test": "[director-092] The session uses its supplied deadline",
    "output": [
      "KILLED",
      "[director-092] The session uses its supplied deadline"
    ]
  },
  "m272": {
    "test": "[director-092] The session uses its default deadline",
    "output": [
      "KILLED",
      "[director-092] The session uses its default deadline"
    ]
  },
  "m273": {
    "test": "[director-092] The session removes resources after a later error",
    "output": [
      "KILLED",
      "[director-092] The session removes resources after a later error"
    ]
  },
  "m274": {
    "test": "[director-099] The bundle accepts the application/json media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the application/json media type"
    ]
  },
  "m275": {
    "test": "[director-099] The bundle accepts the application/geo+json media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the application/geo+json media type"
    ]
  },
  "m276": {
    "test": "[director-099] The bundle accepts the image/png media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the image/png media type"
    ]
  },
  "m277": {
    "test": "[director-099] The bundle accepts the video/mp4 media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the video/mp4 media type"
    ]
  },
  "m278": {
    "test": "[director-099] The bundle accepts the video/webm media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the video/webm media type"
    ]
  },
  "m279": {
    "test": "[director-099] The bundle accepts the audio/mpeg media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the audio/mpeg media type"
    ]
  },
  "m280": {
    "test": "[director-099] The bundle accepts the audio/ogg media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the audio/ogg media type"
    ]
  },
  "m281": {
    "test": "[director-099] The bundle accepts the audio/wav media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the audio/wav media type"
    ]
  },
  "m282": {
    "test": "[director-099] The bundle accepts the audio/webm media type",
    "output": [
      "KILLED",
      "[director-099] The bundle accepts the audio/webm media type"
    ]
  },
  "m283": {
    "test": "[director-089] The session rejects a falsy handle with inherited disposal",
    "output": [
      "KILLED",
      "[director-089] The session rejects a falsy handle with inherited disposal"
    ]
  },
  "m284": {
    "test": "Repository tests of the code limit",
    "output": [
      "SURVIVED",
      ""
    ]
  },
  "m285": {
    "test": "[director-083] The collection accepts its exact feature limit",
    "output": [
      "KILLED",
      "[director-083] The collection accepts its exact feature limit"
    ]
  },
  "m286": {
    "test": "[director-084] The feature ID accepts its exact text limit",
    "output": [
      "KILLED",
      "[director-084] The feature ID accepts its exact text limit"
    ]
  },
  "m287": {
    "test": "[director-085] The position accepts its exact total limit",
    "output": [
      "KILLED",
      "[director-085] The position accepts its exact total limit"
    ]
  },
  "m288": {
    "test": "[director-087] The polygon accepts its exact ring limit",
    "output": [
      "KILLED",
      "[director-087] The polygon accepts its exact ring limit"
    ]
  },
  "m289": {
    "test": "[director-076] The asset path checks its text limit",
    "output": [
      "KILLED",
      "[director-076] The asset path checks its text limit"
    ]
  },
  "m290": {
    "test": "[director-102] The export accepts its exact asset total",
    "output": [
      "KILLED",
      "[director-102] The export accepts its exact asset total"
    ]
  },
  "m291": {
    "test": "[director-089] The session keeps every data pack handle",
    "output": [
      "KILLED",
      "[director-089] The session keeps every data pack handle"
    ]
  },
  "m292": {
    "test": "[director-095] The asset request sets its signal option",
    "output": [
      "KILLED",
      "[director-095] The asset request sets its signal option"
    ]
  },
  "m293": {
    "test": "[director-096] The stream accepts its exact byte limit",
    "output": [
      "KILLED",
      "[director-096] The stream accepts its exact byte limit"
    ]
  },
  "m294": {
    "test": "[director-096] The stream accepts its exact byte limit",
    "output": [
      "KILLED",
      "[director-096] The stream accepts its exact byte limit"
    ]
  },
  "m295": {
    "test": "[director-092] The session rejects a falsy custom source",
    "output": [
      "KILLED",
      "[director-092] The session rejects a falsy custom source"
    ]
  },
  "m296": {
    "test": "[director-101] The export writes exact bundle metadata",
    "output": [
      "KILLED",
      "[director-101] The export writes exact bundle metadata"
    ]
  },
  "m297": {
    "test": "[director-101] The export writes exact bundle metadata",
    "output": [
      "KILLED",
      "[director-101] The export writes exact bundle metadata"
    ]
  },
  "m298": {
    "test": "[director-101] The export writes exact bundle metadata",
    "output": [
      "KILLED",
      "[director-101] The export writes exact bundle metadata"
    ]
  },
  "m299": {
    "test": "[director-101] The export writes exact bundle metadata",
    "output": [
      "KILLED",
      "[director-101] The export writes exact bundle metadata"
    ]
  },
  "m300": {
    "test": "[director-101] The export writes exact bundle metadata",
    "output": [
      "KILLED",
      "[director-101] The export writes exact bundle metadata"
    ]
  },
  "m301": {
    "test": "[director-101] The export writes exact bundle metadata",
    "output": [
      "KILLED",
      "[director-101] The export writes exact bundle metadata"
    ]
  },
  "m302": {
    "test": "[director-105] The store returns an independent byte copy",
    "output": [
      "KILLED",
      "[director-105] The store returns an independent byte copy"
    ]
  },
  "m303": {
    "test": "[director-079] The digest rejects 63 characters",
    "output": [
      "KILLED",
      "[director-079] The digest rejects 63 characters"
    ]
  },
  "m304": {
    "test": "[director-079] The digest rejects 65 characters",
    "output": [
      "KILLED",
      "[director-079] The digest rejects 65 characters"
    ]
  },
  "m305": {
    "test": "[director-079] The digest rejects a prefix",
    "output": [
      "KILLED",
      "[director-079] The digest rejects a prefix"
    ]
  },
  "m306": {
    "test": "[director-079] The digest rejects a suffix",
    "output": [
      "KILLED",
      "[director-079] The digest rejects a suffix"
    ]
  },
  "m307": {
    "test": "[director-079] The digest rejects uppercase text",
    "output": [
      "KILLED",
      "[director-079] The digest rejects uppercase text"
    ]
  },
  "m308": {
    "test": "[director-080] The image rejects equal longitude edges",
    "output": [
      "KILLED",
      "[director-080] The image rejects equal longitude edges"
    ]
  },
  "m309": {
    "test": "[director-080] The image rejects equal latitude edges",
    "output": [
      "KILLED",
      "[director-080] The image rejects equal latitude edges"
    ]
  },
  "m310": {
    "test": "[director-080] The image accepts all geographic limits",
    "output": [
      "KILLED",
      "[director-080] The image accepts all geographic limits"
    ]
  },
  "m311": {
    "test": "[director-080] The image accepts all geographic limits",
    "output": [
      "KILLED",
      "[director-080] The image accepts all geographic limits"
    ]
  },
  "m312": {
    "test": "[director-080] The image accepts all geographic limits",
    "output": [
      "KILLED",
      "[director-080] The image accepts all geographic limits"
    ]
  },
  "m313": {
    "test": "[director-080] The image accepts all geographic limits",
    "output": [
      "KILLED",
      "[director-080] The image accepts all geographic limits"
    ]
  },
  "m314": {
    "test": "[director-082] The scene ignores a data pack list from its parent",
    "output": [
      "KILLED",
      "[director-082] The scene ignores a data pack list from its parent"
    ]
  },
  "m315": {
    "test": "[director-080] The image rejects text for each geographic field",
    "output": [
      "KILLED",
      "[director-080] The image rejects text for each geographic field"
    ]
  },
  "m316": {
    "test": "[director-080] The image rejects text for each geographic field",
    "output": [
      "KILLED",
      "[director-080] The image rejects text for each geographic field"
    ]
  },
  "m317": {
    "test": "[director-078] The attribution accepts its text limits and rejects excess text",
    "output": [
      "KILLED",
      "[director-078] The attribution accepts its text limits and rejects excess text"
    ]
  },
  "m318": {
    "test": "[director-078] The attribution accepts its text limits and rejects excess text",
    "output": [
      "KILLED",
      "[director-078] The attribution accepts its text limits and rejects excess text"
    ]
  },
  "m319": {
    "test": "[director-078] The attribution accepts its text limits and rejects excess text",
    "output": [
      "KILLED",
      "[director-078] The attribution accepts its text limits and rejects excess text"
    ]
  },
  "m320": {
    "test": "[director-076] The asset path accepts 1024 characters and rejects 1025",
    "output": [
      "KILLED",
      "[director-076] The asset path accepts 1024 characters and rejects 1025"
    ]
  },
  "m321": {
    "test": "[director-076] The asset path rejects URL syntax with a stable message",
    "output": [
      "KILLED",
      "[director-076] The asset path rejects URL syntax with a stable message"
    ]
  },
  "m322": {
    "test": "[director-088] The session accepts eight data packs",
    "output": [
      "KILLED",
      "[director-088] The session accepts eight data packs"
    ]
  },
  "m323": {
    "test": "[director-093] The session accepts the asset byte limit",
    "output": [
      "KILLED",
      "[director-093] The session accepts the asset byte limit"
    ]
  },
  "m324": {
    "test": "[director-093] The session accepts the total byte limit",
    "output": [
      "KILLED",
      "[director-093] The session accepts the total byte limit"
    ]
  },
  "m325": {
    "test": "[director-093] The source receives the path and the renderer receives the asset and signal",
    "output": [
      "KILLED",
      "[director-093] The source receives the path and the renderer receives the asset and signal"
    ]
  },
  "m326": {
    "test": "[director-093] The source receives the path and the renderer receives the asset and signal",
    "output": [
      "KILLED",
      "[director-093] The source receives the path and the renderer receives the asset and signal"
    ]
  },
  "m327": {
    "test": "[director-093] The source receives the path and the renderer receives the asset and signal",
    "output": [
      "KILLED",
      "[director-093] The source receives the path and the renderer receives the asset and signal"
    ]
  },
  "m328": {
    "test": "[director-089] The session removes its deadline after success",
    "output": [
      "KILLED",
      "[director-089] The session removes its deadline after success"
    ]
  },
  "m329": {
    "test": "[director-089] The session removes its deadline after clear",
    "output": [
      "KILLED",
      "[director-089] The session removes its deadline after clear"
    ]
  },
  "m330": {
    "test": "[director-088] The session checks every declaration before the source call",
    "output": [
      "KILLED",
      "[director-088] The session checks every declaration before the source call"
    ]
  },
  "m331": {
    "test": "[director-089] The session destroys each ready resource",
    "output": [
      "KILLED",
      "[director-089] The session destroys each ready resource"
    ]
  },
  "m332": {
    "test": "[director-088] The session checks every declaration before the source call",
    "output": [
      "KILLED",
      "[director-088] The session checks every declaration before the source call"
    ]
  },
  "m333": {
    "test": "[director-083] The decoder rejects invalid UTF8 bytes",
    "output": [
      "KILLED",
      "[director-083] The decoder rejects invalid UTF8 bytes"
    ]
  },
  "m334": {
    "test": "[director-083] The decoder rejects null",
    "output": [
      "KILLED",
      "[director-083] The decoder rejects null"
    ]
  },
  "m335": {
    "test": "[director-084] The decoder rejects a null feature",
    "output": [
      "KILLED",
      "[director-084] The decoder rejects a null feature"
    ]
  },
  "m336": {
    "test": "[director-084] The decoder rejects a null feature",
    "output": [
      "KILLED",
      "[director-084] The decoder rejects a null feature"
    ]
  },
  "m337": {
    "test": "[director-087] The decoder rejects absent geometry",
    "output": [
      "KILLED",
      "[director-087] The decoder rejects absent geometry"
    ]
  },
  "m338": {
    "test": "[director-087] The decoder rejects absent geometry",
    "output": [
      "KILLED",
      "[director-087] The decoder rejects absent geometry"
    ]
  },
  "m339": {
    "test": "[director-087] The decoder rejects absent geometry",
    "output": [
      "KILLED",
      "[director-087] The decoder rejects absent geometry"
    ]
  },
  "m340": {
    "test": "[director-095] The directory source uses the default fetch function",
    "output": [
      "KILLED",
      "[director-095] The directory source uses the default fetch function"
    ]
  },
  "m341": {
    "test": "[director-102] The export accepts the asset byte limit",
    "output": [
      "KILLED",
      "[director-102] The export accepts the asset byte limit"
    ]
  },
  "m342": {
    "test": "[director-102] The export accepts the total byte limit and rejects one more byte",
    "output": [
      "KILLED",
      "[director-102] The export accepts the total byte limit and rejects one more byte"
    ]
  },
  "m343": {
    "test": "[director-099] The base64 accepts its length limit and rejects the next aligned length",
    "output": [
      "KILLED",
      "[director-099] The base64 accepts its length limit and rejects the next aligned length"
    ]
  },
  "m344": {
    "test": "[director-106] The share helpers accept the project file limit and reject one more byte",
    "output": [
      "KILLED",
      "[director-106] The share helpers accept the project file limit and reject one more byte"
    ]
  },
  "m345": {
    "test": "[director-106] The share helpers accept the bundle file limit and reject one more byte",
    "output": [
      "KILLED",
      "[director-106] The share helpers accept the bundle file limit and reject one more byte"
    ]
  },
  "m346": {
    "test": "[director-102] The export rejects an unsupported media type",
    "output": [
      "KILLED",
      "[director-102] The export rejects an unsupported media type"
    ]
  },
  "m347": {
    "test": "[director-099] The import rejects 65 different asset paths",
    "output": [
      "KILLED",
      "[director-099] The import rejects 65 different asset paths"
    ]
  },
  "m348": {
    "test": "[director-099] The import accepts the total byte limit and rejects one more byte",
    "output": [
      "KILLED",
      "[director-099] The import accepts the total byte limit and rejects one more byte"
    ]
  },
  "m349": {
    "test": "[director-099] The import accepts the total byte limit and rejects one more byte",
    "output": [
      "KILLED",
      "[director-099] The import accepts the total byte limit and rejects one more byte"
    ]
  },
  "m350": {
    "test": "[director-105] The store rejects a cancelled source call",
    "output": [
      "KILLED",
      "[director-105] The store rejects a cancelled source call"
    ]
  },
  "m351": {
    "test": "[director-107] The bundle stops import before an asset",
    "output": [
      "KILLED",
      "[director-107] The bundle stops import before an asset"
    ]
  },
  "m352": {
    "test": "[director-107] The bundle stops import after a digest",
    "output": [
      "KILLED",
      "[director-107] The bundle stops import after a digest"
    ]
  },
  "m353": {
    "test": "[director-107] The bundle stops export before an asset",
    "output": [
      "KILLED",
      "[director-107] The bundle stops export before an asset"
    ]
  },
  "m354": {
    "test": "[director-107] The bundle stops export after asset bytes",
    "output": [
      "KILLED",
      "[director-107] The bundle stops export after asset bytes"
    ]
  },
  "m355": {
    "test": "[director-107] The bundle stops export after a digest",
    "output": [
      "KILLED",
      "[director-107] The bundle stops export after a digest"
    ]
  },
  "m356": {
    "test": "[director-108] The preview counts shots apart from scenes",
    "output": [
      "KILLED",
      "[director-108] The preview counts shots apart from scenes"
    ]
  },
  "m357": {
    "test": "[director-108] The preview counts shots apart from scenes",
    "output": [
      "KILLED",
      "[director-108] The preview counts shots apart from scenes"
    ]
  },
  "m358": {
    "test": "[director-110] The preview lists distinct absent layers",
    "output": [
      "KILLED",
      "[director-110] The preview lists distinct absent layers"
    ]
  },
  "m359": {
    "test": "[director-077] The manifest accepts 256 characters for its ID and rejects 257",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts 256 characters for its ID and rejects 257"
    ]
  },
  "m360": {
    "test": "[director-077] The manifest accepts 256 characters for its ID and rejects 257",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts 256 characters for its ID and rejects 257"
    ]
  },
  "m361": {
    "test": "[director-077] The manifest accepts 256 characters for its source name and rejects 257",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts 256 characters for its source name and rejects 257"
    ]
  },
  "m362": {
    "test": "[director-077] The manifest accepts 256 characters for its source name and rejects 257",
    "output": [
      "KILLED",
      "[director-077] The manifest accepts 256 characters for its source name and rejects 257"
    ]
  },
  "m363": {
    "test": "[director-078] The attribution accepts its text limits and rejects excess text",
    "output": [
      "KILLED",
      "[director-078] The attribution accepts its text limits and rejects excess text"
    ]
  },
  "m364": {
    "test": "[director-078] The attribution accepts its text limits and rejects excess text",
    "output": [
      "KILLED",
      "[director-078] The attribution accepts its text limits and rejects excess text"
    ]
  },
  "m365": {
    "test": "[director-078] The attribution accepts its text limits and rejects excess text",
    "output": [
      "KILLED",
      "[director-078] The attribution accepts its text limits and rejects excess text"
    ]
  },
  "m366": {
    "test": "[director-076] The asset path accepts 1024 characters and rejects 1025",
    "output": [
      "KILLED",
      "[director-076] The asset path accepts 1024 characters and rejects 1025"
    ]
  },
  "m367": {
    "test": "[director-102] The export rejects excess asset total",
    "output": [
      "KILLED",
      "[director-102] The export rejects excess asset total"
    ]
  },
  "m408": {
    "test": "[director-101] The export rejects an invalid project",
    "output": [
      "KILLED",
      "[director-101] The export rejects an invalid project"
    ]
  }
}
```

## Totals

The command below gives these totals.

```json
{
  "rows": 1079,
  "classes": {
    "OPEN": 661,
    "TESTED": 415,
    "known limit": 2,
    "EQUIVALENT": 1
  }
}
```

```sh
cd /home/ianblenke/docker/gev-work/director-3 && taskset -c 12-15 nice -n 19 python3 /home/ianblenke/docker/gev-tools/director-3/pass3-audit-final.py
```

## Operand text

```json
[
  {
    "row": "a0001",
    "operand": "Object.freeze({\n  packs: 8,\n  bytes: 8 * 1024 * 1024,\n  totalBytes: 32 * 1024 * 1024,\n  features: 2000,\n  positions: 50000,\n})"
  },
  {
    "row": "a0002",
    "operand": "{\n  packs: 8,\n  bytes: 8 * 1024 * 1024,\n  totalBytes: 32 * 1024 * 1024,\n  features: 2000,\n  positions: 50000,\n}"
  },
  {
    "row": "a0003",
    "operand": "8"
  },
  {
    "row": "a0004",
    "operand": "2000"
  },
  {
    "row": "a0005",
    "operand": "50000"
  },
  {
    "row": "a0006",
    "operand": "path = 'source.path'"
  },
  {
    "row": "a0007",
    "operand": "string(value, path, 1024)"
  },
  {
    "row": "a0008",
    "operand": "value"
  },
  {
    "row": "a0009",
    "operand": "path"
  },
  {
    "row": "a0010",
    "operand": "1024"
  },
  {
    "row": "a0011",
    "operand": "value\n      .split('/')\n      .every((part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part))"
  },
  {
    "row": "a0012",
    "operand": "(part) => /^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part)"
  },
  {
    "row": "a0013",
    "operand": "value\n      .split('/')"
  },
  {
    "row": "a0014",
    "operand": "'/'"
  },
  {
    "row": "a0015",
    "operand": "/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/.test(part)"
  },
  {
    "row": "a0016",
    "operand": "part"
  },
  {
    "row": "a0017",
    "operand": "/^[a-zA-Z0-9_-][a-zA-Z0-9_.-]*$/"
  },
  {
    "row": "a0018",
    "operand": "^"
  },
  {
    "row": "a0019",
    "operand": "[a-zA-Z0-9_-]"
  },
  {
    "row": "a0020",
    "operand": "[a-zA-Z0-9_.-]"
  },
  {
    "row": "a0021",
    "operand": "$"
  },
  {
    "row": "a0022",
    "operand": "fail(\n      path,\n      'expected a relative asset path without URL syntax or traversal',\n    )"
  },
  {
    "row": "a0023",
    "operand": "path"
  },
  {
    "row": "a0024",
    "operand": "'expected a relative asset path without URL syntax or traversal'"
  },
  {
    "row": "a0025",
    "operand": "fields(pack, path, [\n    'id',\n    'version',\n    'format',\n    'source',\n    'attribution',\n    'placement',\n    'byteLength',\n    'sha256',\n  ])"
  },
  {
    "row": "a0026",
    "operand": "pack"
  },
  {
    "row": "a0027",
    "operand": "path"
  },
  {
    "row": "a0028",
    "operand": "[\n    'id',\n    'version',\n    'format',\n    'source',\n    'attribution',\n    'placement',\n    'byteLength',\n    'sha256',\n  ]"
  },
  {
    "row": "a0029",
    "operand": "string(pack.id, `${path}.id`)"
  },
  {
    "row": "a0030",
    "operand": "pack.id"
  },
  {
    "row": "a0031",
    "operand": "`${path}.id`"
  },
  {
    "row": "a0032",
    "operand": "pack.version !== 1"
  },
  {
    "row": "a0033",
    "operand": "fail(`${path}.version`, 'unsupported pack version')"
  },
  {
    "row": "a0034",
    "operand": "`${path}.version`"
  },
  {
    "row": "a0035",
    "operand": "'unsupported pack version'"
  },
  {
    "row": "a0036",
    "operand": "['geojson', 'image', 'media'].includes(pack.format)"
  },
  {
    "row": "a0037",
    "operand": "pack.format"
  },
  {
    "row": "a0038",
    "operand": "fail(`${path}.format`, 'unsupported pack format')"
  },
  {
    "row": "a0039",
    "operand": "`${path}.format`"
  },
  {
    "row": "a0040",
    "operand": "'unsupported pack format'"
  },
  {
    "row": "a0041",
    "operand": "fields(pack.source, `${path}.source`, ['adapter', 'path'])"
  },
  {
    "row": "a0042",
    "operand": "pack.source"
  },
  {
    "row": "a0043",
    "operand": "`${path}.source`"
  },
  {
    "row": "a0044",
    "operand": "['adapter', 'path']"
  },
  {
    "row": "a0045",
    "operand": "string(pack.source.adapter, `${path}.source.adapter`)"
  },
  {
    "row": "a0046",
    "operand": "pack.source.adapter"
  },
  {
    "row": "a0047",
    "operand": "`${path}.source.adapter`"
  },
  {
    "row": "a0048",
    "operand": "validateAssetPath(pack.source.path, `${path}.source.path`)"
  },
  {
    "row": "a0049",
    "operand": "pack.source.path"
  },
  {
    "row": "a0050",
    "operand": "`${path}.source.path`"
  },
  {
    "row": "a0051",
    "operand": "fields(pack.attribution, `${path}.attribution`, ['text', 'license', 'url'])"
  },
  {
    "row": "a0052",
    "operand": "pack.attribution"
  },
  {
    "row": "a0053",
    "operand": "`${path}.attribution`"
  },
  {
    "row": "a0054",
    "operand": "['text', 'license', 'url']"
  },
  {
    "row": "a0055",
    "operand": "string(pack.attribution.text, `${path}.attribution.text`, 4096)"
  },
  {
    "row": "a0056",
    "operand": "pack.attribution.text"
  },
  {
    "row": "a0057",
    "operand": "`${path}.attribution.text`"
  },
  {
    "row": "a0058",
    "operand": "4096"
  },
  {
    "row": "a0059",
    "operand": "string(pack.attribution.license, `${path}.attribution.license`, 4096)"
  },
  {
    "row": "a0060",
    "operand": "pack.attribution.license"
  },
  {
    "row": "a0061",
    "operand": "`${path}.attribution.license`"
  },
  {
    "row": "a0062",
    "operand": "4096"
  },
  {
    "row": "a0063",
    "operand": "optional(pack.attribution, 'url', `${path}.attribution`, (url, at) => {\n    string(url, at, 2048);\n    let parsed;\n    try {\n      parsed = new URL(url);\n    } catch {\n      fail(at, 'expected an HTTPS source link');\n    }\n    if (\n      parsed.protocol !== 'https:' ||\n      parsed.username ||\n      parsed.password ||\n      parsed.search ||\n      parsed.hash\n    )\n      fail(\n        at,\n        'expected an HTTPS source link without credentials, query or fragment',\n      );\n  })"
  },
  {
    "row": "a0064",
    "operand": "pack.attribution"
  },
  {
    "row": "a0065",
    "operand": "'url'"
  },
  {
    "row": "a0066",
    "operand": "`${path}.attribution`"
  },
  {
    "row": "a0067",
    "operand": "(url, at) => {\n    string(url, at, 2048);\n    let parsed;\n    try {\n      parsed = new URL(url);\n    } catch {\n      fail(at, 'expected an HTTPS source link');\n    }\n    if (\n      parsed.protocol !== 'https:' ||\n      parsed.username ||\n      parsed.password ||\n      parsed.search ||\n      parsed.hash\n    )\n      fail(\n        at,\n        'expected an HTTPS source link without credentials, query or fragment',\n      );\n  }"
  },
  {
    "row": "a0068",
    "operand": "string(url, at, 2048)"
  },
  {
    "row": "a0069",
    "operand": "url"
  },
  {
    "row": "a0070",
    "operand": "at"
  },
  {
    "row": "a0071",
    "operand": "2048"
  },
  {
    "row": "a0072",
    "operand": "new URL(url)"
  },
  {
    "row": "a0073",
    "operand": "url"
  },
  {
    "row": "a0074",
    "operand": "fail(at, 'expected an HTTPS source link')"
  },
  {
    "row": "a0075",
    "operand": "at"
  },
  {
    "row": "a0076",
    "operand": "'expected an HTTPS source link'"
  },
  {
    "row": "a0077",
    "operand": "parsed.protocol !== 'https:' ||\n      parsed.username ||\n      parsed.password ||\n      parsed.search"
  },
  {
    "row": "a0078",
    "operand": "parsed.hash"
  },
  {
    "row": "a0079",
    "operand": "parsed.protocol !== 'https:' ||\n      parsed.username ||\n      parsed.password"
  },
  {
    "row": "a0080",
    "operand": "parsed.search"
  },
  {
    "row": "a0081",
    "operand": "parsed.protocol !== 'https:' ||\n      parsed.username"
  },
  {
    "row": "a0082",
    "operand": "parsed.password"
  },
  {
    "row": "a0083",
    "operand": "parsed.protocol !== 'https:'"
  },
  {
    "row": "a0084",
    "operand": "parsed.username"
  },
  {
    "row": "a0085",
    "operand": "parsed.protocol !== 'https:'"
  },
  {
    "row": "a0086",
    "operand": "fail(\n        at,\n        'expected an HTTPS source link without credentials, query or fragment',\n      )"
  },
  {
    "row": "a0087",
    "operand": "at"
  },
  {
    "row": "a0088",
    "operand": "'expected an HTTPS source link without credentials, query or fragment'"
  },
  {
    "row": "a0089",
    "operand": "optional(pack, 'byteLength', path, (v, at) => {\n    number(v, at, 1, PACK_LIMITS.bytes, false);\n    if (!Number.isInteger(v)) fail(at, 'expected an integer');\n  })"
  },
  {
    "row": "a0090",
    "operand": "pack"
  },
  {
    "row": "a0091",
    "operand": "'byteLength'"
  },
  {
    "row": "a0092",
    "operand": "path"
  },
  {
    "row": "a0093",
    "operand": "(v, at) => {\n    number(v, at, 1, PACK_LIMITS.bytes, false);\n    if (!Number.isInteger(v)) fail(at, 'expected an integer');\n  }"
  },
  {
    "row": "a0094",
    "operand": "number(v, at, 1, PACK_LIMITS.bytes, false)"
  },
  {
    "row": "a0095",
    "operand": "v"
  },
  {
    "row": "a0096",
    "operand": "at"
  },
  {
    "row": "a0097",
    "operand": "1"
  },
  {
    "row": "a0098",
    "operand": "PACK_LIMITS.bytes"
  },
  {
    "row": "a0099",
    "operand": "false"
  },
  {
    "row": "a0100",
    "operand": "Number.isInteger(v)"
  },
  {
    "row": "a0101",
    "operand": "v"
  },
  {
    "row": "a0102",
    "operand": "fail(at, 'expected an integer')"
  },
  {
    "row": "a0103",
    "operand": "at"
  },
  {
    "row": "a0104",
    "operand": "'expected an integer'"
  },
  {
    "row": "a0105",
    "operand": "optional(pack, 'sha256', path, (v, at) => {\n    if (typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v))\n      fail(at, 'expected a lowercase SHA-256 digest');\n  })"
  },
  {
    "row": "a0106",
    "operand": "pack"
  },
  {
    "row": "a0107",
    "operand": "'sha256'"
  },
  {
    "row": "a0108",
    "operand": "path"
  },
  {
    "row": "a0109",
    "operand": "(v, at) => {\n    if (typeof v !== 'string' || !/^[a-f0-9]{64}$/.test(v))\n      fail(at, 'expected a lowercase SHA-256 digest');\n  }"
  },
  {
    "row": "a0110",
    "operand": "typeof v !== 'string'"
  },
  {
    "row": "a0111",
    "operand": "!/^[a-f0-9]{64}$/.test(v)"
  },
  {
    "row": "a0112",
    "operand": "typeof v !== 'string'"
  },
  {
    "row": "a0113",
    "operand": "/^[a-f0-9]{64}$/.test(v)"
  },
  {
    "row": "a0114",
    "operand": "v"
  },
  {
    "row": "a0115",
    "operand": "/^[a-f0-9]{64}$/"
  },
  {
    "row": "a0116",
    "operand": "^"
  },
  {
    "row": "a0117",
    "operand": "[a-f0-9]"
  },
  {
    "row": "a0118",
    "operand": "$"
  },
  {
    "row": "a0119",
    "operand": "fail(at, 'expected a lowercase SHA-256 digest')"
  },
  {
    "row": "a0120",
    "operand": "at"
  },
  {
    "row": "a0121",
    "operand": "'expected a lowercase SHA-256 digest'"
  },
  {
    "row": "a0122",
    "operand": "fields(\n    p,\n    at,\n    pack.format === 'image'\n      ? ['bounds', 'height', 'altitudeReference']\n      : pack.format === 'media'\n        ? ['anchorId']\n        : ['altitudeReference'],\n  )"
  },
  {
    "row": "a0123",
    "operand": "p"
  },
  {
    "row": "a0124",
    "operand": "at"
  },
  {
    "row": "a0125",
    "operand": "pack.format === 'image'\n      ? ['bounds', 'height', 'altitudeReference']\n      : pack.format === 'media'\n        ? ['anchorId']\n        : ['altitudeReference']"
  },
  {
    "row": "a0126",
    "operand": "pack.format === 'image'"
  },
  {
    "row": "a0127",
    "operand": "['bounds', 'height', 'altitudeReference']"
  },
  {
    "row": "a0128",
    "operand": "pack.format === 'media'\n        ? ['anchorId']\n        : ['altitudeReference']"
  },
  {
    "row": "a0129",
    "operand": "pack.format === 'image'"
  },
  {
    "row": "a0130",
    "operand": "pack.format === 'media'"
  },
  {
    "row": "a0131",
    "operand": "['anchorId']"
  },
  {
    "row": "a0132",
    "operand": "['altitudeReference']"
  },
  {
    "row": "a0133",
    "operand": "pack.format === 'media'"
  },
  {
    "row": "a0134",
    "operand": "pack.format === 'media'"
  },
  {
    "row": "a0135",
    "operand": "anchorIds.has(p.anchorId)"
  },
  {
    "row": "a0136",
    "operand": "p.anchorId"
  },
  {
    "row": "a0137",
    "operand": "fail(`${at}.anchorId`, 'unknown scene anchor')"
  },
  {
    "row": "a0138",
    "operand": "`${at}.anchorId`"
  },
  {
    "row": "a0139",
    "operand": "'unknown scene anchor'"
  },
  {
    "row": "a0140",
    "operand": "p.altitudeReference !== 'ellipsoid'"
  },
  {
    "row": "a0141",
    "operand": "fail(`${at}.altitudeReference`, 'expected ellipsoid height in meters')"
  },
  {
    "row": "a0142",
    "operand": "`${at}.altitudeReference`"
  },
  {
    "row": "a0143",
    "operand": "'expected ellipsoid height in meters'"
  },
  {
    "row": "a0144",
    "operand": "pack.format === 'image'"
  },
  {
    "row": "a0145",
    "operand": "array(p.bounds, `${at}.bounds`, 4)"
  },
  {
    "row": "a0146",
    "operand": "p.bounds"
  },
  {
    "row": "a0147",
    "operand": "`${at}.bounds`"
  },
  {
    "row": "a0148",
    "operand": "4"
  },
  {
    "row": "a0149",
    "operand": "p.bounds.length !== 4"
  },
  {
    "row": "a0150",
    "operand": "fail(`${at}.bounds`, 'expected west, south, east, north')"
  },
  {
    "row": "a0151",
    "operand": "`${at}.bounds`"
  },
  {
    "row": "a0152",
    "operand": "'expected west, south, east, north'"
  },
  {
    "row": "a0153",
    "operand": "p.bounds.forEach((v, i) =>\n        number(\n          v,\n          `${at}.bounds[${i}]`,\n          i % 2 ? -90 : -180,\n          i % 2 ? 90 : 180,\n          false,\n        ),\n      )"
  },
  {
    "row": "a0154",
    "operand": "(v, i) =>\n        number(\n          v,\n          `${at}.bounds[${i}]`,\n          i % 2 ? -90 : -180,\n          i % 2 ? 90 : 180,\n          false,\n        )"
  },
  {
    "row": "a0155",
    "operand": "number(\n          v,\n          `${at}.bounds[${i}]`,\n          i % 2 ? -90 : -180,\n          i % 2 ? 90 : 180,\n          false,\n        )"
  },
  {
    "row": "a0156",
    "operand": "v"
  },
  {
    "row": "a0157",
    "operand": "`${at}.bounds[${i}]`"
  },
  {
    "row": "a0158",
    "operand": "i % 2 ? -90 : -180"
  },
  {
    "row": "a0159",
    "operand": "i % 2 ? 90 : 180"
  },
  {
    "row": "a0160",
    "operand": "false"
  },
  {
    "row": "a0161",
    "operand": "i % 2"
  },
  {
    "row": "a0162",
    "operand": "-90"
  },
  {
    "row": "a0163",
    "operand": "-180"
  },
  {
    "row": "a0164",
    "operand": "i % 2"
  },
  {
    "row": "a0165",
    "operand": "90"
  },
  {
    "row": "a0166",
    "operand": "180"
  },
  {
    "row": "a0167",
    "operand": "p.bounds[0] >= p.bounds[2]"
  },
  {
    "row": "a0168",
    "operand": "p.bounds[1] >= p.bounds[3]"
  },
  {
    "row": "a0169",
    "operand": "p.bounds[0] >= p.bounds[2]"
  },
  {
    "row": "a0170",
    "operand": "p.bounds[1] >= p.bounds[3]"
  },
  {
    "row": "a0171",
    "operand": "fail(`${at}.bounds`, 'expected increasing non-dateline bounds')"
  },
  {
    "row": "a0172",
    "operand": "`${at}.bounds`"
  },
  {
    "row": "a0173",
    "operand": "'expected increasing non-dateline bounds'"
  },
  {
    "row": "a0174",
    "operand": "number(p.height, `${at}.height`, -12000, 1e9, false)"
  },
  {
    "row": "a0175",
    "operand": "p.height"
  },
  {
    "row": "a0176",
    "operand": "`${at}.height`"
  },
  {
    "row": "a0177",
    "operand": "-12000"
  },
  {
    "row": "a0178",
    "operand": "1e9"
  },
  {
    "row": "a0179",
    "operand": "false"
  },
  {
    "row": "a0180",
    "operand": "Object.hasOwn(scene, 'dataPacks')"
  },
  {
    "row": "a0181",
    "operand": "scene.dataPacks"
  },
  {
    "row": "a0182",
    "operand": "[]"
  },
  {
    "row": "a0183",
    "operand": "Object.hasOwn(scene, 'dataPacks')"
  },
  {
    "row": "a0184",
    "operand": "scene"
  },
  {
    "row": "a0185",
    "operand": "'dataPacks'"
  },
  {
    "row": "a0186",
    "operand": "array(packs, `${path}.dataPacks`, PACK_LIMITS.packs)"
  },
  {
    "row": "a0187",
    "operand": "packs"
  },
  {
    "row": "a0188",
    "operand": "`${path}.dataPacks`"
  },
  {
    "row": "a0189",
    "operand": "PACK_LIMITS.packs"
  },
  {
    "row": "a0190",
    "operand": "new Set((scene.anchors || []).map((a) => a.id))"
  },
  {
    "row": "a0191",
    "operand": "(scene.anchors || []).map((a) => a.id)"
  },
  {
    "row": "a0192",
    "operand": "(scene.anchors || []).map((a) => a.id)"
  },
  {
    "row": "a0193",
    "operand": "(a) => a.id"
  },
  {
    "row": "a0194",
    "operand": "scene.anchors"
  },
  {
    "row": "a0195",
    "operand": "[]"
  },
  {
    "row": "a0196",
    "operand": "new Set()"
  },
  {
    "row": "a0197",
    "operand": "packs.forEach((pack, i) => {\n    validateDataPack(pack, `${path}.dataPacks[${i}]`, anchors);\n    if (seen.has(pack.id))\n      fail(`${path}.dataPacks[${i}].id`, 'duplicate pack ID');\n    seen.add(pack.id);\n  })"
  },
  {
    "row": "a0198",
    "operand": "(pack, i) => {\n    validateDataPack(pack, `${path}.dataPacks[${i}]`, anchors);\n    if (seen.has(pack.id))\n      fail(`${path}.dataPacks[${i}].id`, 'duplicate pack ID');\n    seen.add(pack.id);\n  }"
  },
  {
    "row": "a0199",
    "operand": "validateDataPack(pack, `${path}.dataPacks[${i}]`, anchors)"
  },
  {
    "row": "a0200",
    "operand": "pack"
  },
  {
    "row": "a0201",
    "operand": "`${path}.dataPacks[${i}]`"
  },
  {
    "row": "a0202",
    "operand": "anchors"
  },
  {
    "row": "a0203",
    "operand": "seen.has(pack.id)"
  },
  {
    "row": "a0204",
    "operand": "pack.id"
  },
  {
    "row": "a0205",
    "operand": "fail(`${path}.dataPacks[${i}].id`, 'duplicate pack ID')"
  },
  {
    "row": "a0206",
    "operand": "`${path}.dataPacks[${i}].id`"
  },
  {
    "row": "a0207",
    "operand": "'duplicate pack ID'"
  },
  {
    "row": "a0208",
    "operand": "seen.add(pack.id)"
  },
  {
    "row": "a0209",
    "operand": "pack.id"
  },
  {
    "row": "a0210",
    "operand": "scene.shots.forEach((shot, i) => {\n    optional(shot, 'dataPackIds', `${path}.shots[${i}]`, (ids, at) => {\n      array(ids, at, PACK_LIMITS.packs);\n      if (new Set(ids).size !== ids.length || ids.some((id) => !seen.has(id)))\n        fail(at, 'expected distinct scene pack IDs');\n    });\n  })"
  },
  {
    "row": "a0211",
    "operand": "(shot, i) => {\n    optional(shot, 'dataPackIds', `${path}.shots[${i}]`, (ids, at) => {\n      array(ids, at, PACK_LIMITS.packs);\n      if (new Set(ids).size !== ids.length || ids.some((id) => !seen.has(id)))\n        fail(at, 'expected distinct scene pack IDs');\n    });\n  }"
  },
  {
    "row": "a0212",
    "operand": "optional(shot, 'dataPackIds', `${path}.shots[${i}]`, (ids, at) => {\n      array(ids, at, PACK_LIMITS.packs);\n      if (new Set(ids).size !== ids.length || ids.some((id) => !seen.has(id)))\n        fail(at, 'expected distinct scene pack IDs');\n    })"
  },
  {
    "row": "a0213",
    "operand": "shot"
  },
  {
    "row": "a0214",
    "operand": "'dataPackIds'"
  },
  {
    "row": "a0215",
    "operand": "`${path}.shots[${i}]`"
  },
  {
    "row": "a0216",
    "operand": "(ids, at) => {\n      array(ids, at, PACK_LIMITS.packs);\n      if (new Set(ids).size !== ids.length || ids.some((id) => !seen.has(id)))\n        fail(at, 'expected distinct scene pack IDs');\n    }"
  },
  {
    "row": "a0217",
    "operand": "array(ids, at, PACK_LIMITS.packs)"
  },
  {
    "row": "a0218",
    "operand": "ids"
  },
  {
    "row": "a0219",
    "operand": "at"
  },
  {
    "row": "a0220",
    "operand": "PACK_LIMITS.packs"
  },
  {
    "row": "a0221",
    "operand": "new Set(ids).size !== ids.length"
  },
  {
    "row": "a0222",
    "operand": "ids.some((id) => !seen.has(id))"
  },
  {
    "row": "a0223",
    "operand": "new Set(ids).size !== ids.length"
  },
  {
    "row": "a0224",
    "operand": "new Set(ids)"
  },
  {
    "row": "a0225",
    "operand": "ids"
  },
  {
    "row": "a0226",
    "operand": "ids.some((id) => !seen.has(id))"
  },
  {
    "row": "a0227",
    "operand": "(id) => !seen.has(id)"
  },
  {
    "row": "a0228",
    "operand": "seen.has(id)"
  },
  {
    "row": "a0229",
    "operand": "id"
  },
  {
    "row": "a0230",
    "operand": "fail(at, 'expected distinct scene pack IDs')"
  },
  {
    "row": "a0231",
    "operand": "at"
  },
  {
    "row": "a0232",
    "operand": "'expected distinct scene pack IDs'"
  },
  {
    "row": "a0233",
    "operand": "JSON.parse(\n    new TextDecoder('utf-8', { fatal: true }).decode(bytes),\n  )"
  },
  {
    "row": "a0234",
    "operand": "new TextDecoder('utf-8', { fatal: true }).decode(bytes)"
  },
  {
    "row": "a0235",
    "operand": "new TextDecoder('utf-8', { fatal: true }).decode(bytes)"
  },
  {
    "row": "a0236",
    "operand": "bytes"
  },
  {
    "row": "a0237",
    "operand": "new TextDecoder('utf-8', { fatal: true })"
  },
  {
    "row": "a0238",
    "operand": "'utf-8'"
  },
  {
    "row": "a0239",
    "operand": "{ fatal: true }"
  },
  {
    "row": "a0240",
    "operand": "true"
  },
  {
    "row": "a0241",
    "operand": "value?.type !== 'FeatureCollection' ||\n    !Array.isArray(value.features)"
  },
  {
    "row": "a0242",
    "operand": "value.features.length > PACK_LIMITS.features"
  },
  {
    "row": "a0243",
    "operand": "value?.type !== 'FeatureCollection'"
  },
  {
    "row": "a0244",
    "operand": "!Array.isArray(value.features)"
  },
  {
    "row": "a0245",
    "operand": "value?.type !== 'FeatureCollection'"
  },
  {
    "row": "a0246",
    "operand": "value?.type"
  },
  {
    "row": "a0247",
    "operand": "Array.isArray(value.features)"
  },
  {
    "row": "a0248",
    "operand": "value.features"
  },
  {
    "row": "a0249",
    "operand": "value.features.length > PACK_LIMITS.features"
  },
  {
    "row": "a0250",
    "operand": "new Error('Expected a bounded FeatureCollection')"
  },
  {
    "row": "a0251",
    "operand": "'Expected a bounded FeatureCollection'"
  },
  {
    "row": "a0252",
    "operand": "0"
  },
  {
    "row": "a0253",
    "operand": "new Set()"
  },
  {
    "row": "a0254",
    "operand": "!Array.isArray(p) ||\n      ![2, 3].includes(p.length) ||\n      p.some((v) => !Number.isFinite(v)) ||\n      Math.abs(p[0]) > 180 ||\n      Math.abs(p[1]) > 90 ||\n      (p.length === 3 && (p[2] < -12000 || p[2] > 1e9))"
  },
  {
    "row": "a0255",
    "operand": "++positions > PACK_LIMITS.positions"
  },
  {
    "row": "a0256",
    "operand": "!Array.isArray(p) ||\n      ![2, 3].includes(p.length) ||\n      p.some((v) => !Number.isFinite(v)) ||\n      Math.abs(p[0]) > 180 ||\n      Math.abs(p[1]) > 90"
  },
  {
    "row": "a0257",
    "operand": "p.length === 3 && (p[2] < -12000 || p[2] > 1e9)"
  },
  {
    "row": "a0258",
    "operand": "!Array.isArray(p) ||\n      ![2, 3].includes(p.length) ||\n      p.some((v) => !Number.isFinite(v)) ||\n      Math.abs(p[0]) > 180"
  },
  {
    "row": "a0259",
    "operand": "Math.abs(p[1]) > 90"
  },
  {
    "row": "a0260",
    "operand": "!Array.isArray(p) ||\n      ![2, 3].includes(p.length) ||\n      p.some((v) => !Number.isFinite(v))"
  },
  {
    "row": "a0261",
    "operand": "Math.abs(p[0]) > 180"
  },
  {
    "row": "a0262",
    "operand": "!Array.isArray(p) ||\n      ![2, 3].includes(p.length)"
  },
  {
    "row": "a0263",
    "operand": "p.some((v) => !Number.isFinite(v))"
  },
  {
    "row": "a0264",
    "operand": "!Array.isArray(p)"
  },
  {
    "row": "a0265",
    "operand": "![2, 3].includes(p.length)"
  },
  {
    "row": "a0266",
    "operand": "Array.isArray(p)"
  },
  {
    "row": "a0267",
    "operand": "p"
  },
  {
    "row": "a0268",
    "operand": "[2, 3].includes(p.length)"
  },
  {
    "row": "a0269",
    "operand": "p.length"
  },
  {
    "row": "a0270",
    "operand": "p.some((v) => !Number.isFinite(v))"
  },
  {
    "row": "a0271",
    "operand": "(v) => !Number.isFinite(v)"
  },
  {
    "row": "a0272",
    "operand": "Number.isFinite(v)"
  },
  {
    "row": "a0273",
    "operand": "v"
  },
  {
    "row": "a0274",
    "operand": "Math.abs(p[0]) > 180"
  },
  {
    "row": "a0275",
    "operand": "Math.abs(p[0])"
  },
  {
    "row": "a0276",
    "operand": "p[0]"
  },
  {
    "row": "a0277",
    "operand": "Math.abs(p[1]) > 90"
  },
  {
    "row": "a0278",
    "operand": "Math.abs(p[1])"
  },
  {
    "row": "a0279",
    "operand": "p[1]"
  },
  {
    "row": "a0280",
    "operand": "p.length === 3"
  },
  {
    "row": "a0281",
    "operand": "p[2] < -12000 || p[2] > 1e9"
  },
  {
    "row": "a0282",
    "operand": "p.length === 3"
  },
  {
    "row": "a0283",
    "operand": "p[2] < -12000"
  },
  {
    "row": "a0284",
    "operand": "p[2] > 1e9"
  },
  {
    "row": "a0285",
    "operand": "p[2] < -12000"
  },
  {
    "row": "a0286",
    "operand": "p[2] > 1e9"
  },
  {
    "row": "a0287",
    "operand": "++positions > PACK_LIMITS.positions"
  },
  {
    "row": "a0288",
    "operand": "new Error('Invalid geographic position')"
  },
  {
    "row": "a0289",
    "operand": "'Invalid geographic position'"
  },
  {
    "row": "a0290",
    "operand": "p[2]"
  },
  {
    "row": "a0291",
    "operand": "0"
  },
  {
    "row": "a0292",
    "operand": "ring = false"
  },
  {
    "row": "a0293",
    "operand": "!Array.isArray(points)"
  },
  {
    "row": "a0294",
    "operand": "points.length < (ring ? 4 : 2)"
  },
  {
    "row": "a0295",
    "operand": "Array.isArray(points)"
  },
  {
    "row": "a0296",
    "operand": "points"
  },
  {
    "row": "a0297",
    "operand": "points.length < (ring ? 4 : 2)"
  },
  {
    "row": "a0298",
    "operand": "ring"
  },
  {
    "row": "a0299",
    "operand": "4"
  },
  {
    "row": "a0300",
    "operand": "2"
  },
  {
    "row": "a0301",
    "operand": "new Error('Invalid line')"
  },
  {
    "row": "a0302",
    "operand": "'Invalid line'"
  },
  {
    "row": "a0303",
    "operand": "points.map(position)"
  },
  {
    "row": "a0304",
    "operand": "position"
  },
  {
    "row": "a0305",
    "operand": "ring"
  },
  {
    "row": "a0306",
    "operand": "normalized[0].some((v, i) => v !== normalized.at(-1)[i])"
  },
  {
    "row": "a0307",
    "operand": "normalized[0].some((v, i) => v !== normalized.at(-1)[i])"
  },
  {
    "row": "a0308",
    "operand": "(v, i) => v !== normalized.at(-1)[i]"
  },
  {
    "row": "a0309",
    "operand": "v !== normalized.at(-1)[i]"
  },
  {
    "row": "a0310",
    "operand": "normalized.at(-1)"
  },
  {
    "row": "a0311",
    "operand": "-1"
  },
  {
    "row": "a0312",
    "operand": "new Error('Unclosed ring')"
  },
  {
    "row": "a0313",
    "operand": "'Unclosed ring'"
  },
  {
    "row": "a0314",
    "operand": "value.features.map((feature) => {\n    const id = feature?.id;\n    if (\n      feature?.type !== 'Feature' ||\n      typeof id !== 'string' ||\n      !id.trim() ||\n      id.length > 256 ||\n      ids.has(id)\n    )\n      throw new Error('Features require distinct string IDs');\n    ids.add(id);\n    const g = feature.geometry;\n    let coordinates;\n    if (g?.type === 'Point') coordinates = position(g.coordinates);\n    else if (g?.type === 'LineString') coordinates = line(g.coordinates);\n    else if (\n      g?.type === 'Polygon' &&\n      Array.isArray(g.coordinates) &&\n      g.coordinates.length &&\n      g.coordinates.length <= 128\n    )\n      coordinates = g.coordinates.map((ring) => line(ring, true));\n    else throw new Error('Unsupported geometry');\n    return { id, type: g.type, coordinates };\n  })"
  },
  {
    "row": "a0315",
    "operand": "(feature) => {\n    const id = feature?.id;\n    if (\n      feature?.type !== 'Feature' ||\n      typeof id !== 'string' ||\n      !id.trim() ||\n      id.length > 256 ||\n      ids.has(id)\n    )\n      throw new Error('Features require distinct string IDs');\n    ids.add(id);\n    const g = feature.geometry;\n    let coordinates;\n    if (g?.type === 'Point') coordinates = position(g.coordinates);\n    else if (g?.type === 'LineString') coordinates = line(g.coordinates);\n    else if (\n      g?.type === 'Polygon' &&\n      Array.isArray(g.coordinates) &&\n      g.coordinates.length &&\n      g.coordinates.length <= 128\n    )\n      coordinates = g.coordinates.map((ring) => line(ring, true));\n    else throw new Error('Unsupported geometry');\n    return { id, type: g.type, coordinates };\n  }"
  },
  {
    "row": "a0316",
    "operand": "feature?.id"
  },
  {
    "row": "a0317",
    "operand": "feature?.type !== 'Feature' ||\n      typeof id !== 'string' ||\n      !id.trim() ||\n      id.length > 256"
  },
  {
    "row": "a0318",
    "operand": "ids.has(id)"
  },
  {
    "row": "a0319",
    "operand": "feature?.type !== 'Feature' ||\n      typeof id !== 'string' ||\n      !id.trim()"
  },
  {
    "row": "a0320",
    "operand": "id.length > 256"
  },
  {
    "row": "a0321",
    "operand": "feature?.type !== 'Feature' ||\n      typeof id !== 'string'"
  },
  {
    "row": "a0322",
    "operand": "!id.trim()"
  },
  {
    "row": "a0323",
    "operand": "feature?.type !== 'Feature'"
  },
  {
    "row": "a0324",
    "operand": "typeof id !== 'string'"
  },
  {
    "row": "a0325",
    "operand": "feature?.type !== 'Feature'"
  },
  {
    "row": "a0326",
    "operand": "feature?.type"
  },
  {
    "row": "a0327",
    "operand": "typeof id !== 'string'"
  },
  {
    "row": "a0328",
    "operand": "id.trim()"
  },
  {
    "row": "a0329",
    "operand": "id.length > 256"
  },
  {
    "row": "a0330",
    "operand": "ids.has(id)"
  },
  {
    "row": "a0331",
    "operand": "id"
  },
  {
    "row": "a0332",
    "operand": "new Error('Features require distinct string IDs')"
  },
  {
    "row": "a0333",
    "operand": "'Features require distinct string IDs'"
  },
  {
    "row": "a0334",
    "operand": "ids.add(id)"
  },
  {
    "row": "a0335",
    "operand": "id"
  },
  {
    "row": "a0336",
    "operand": "g?.type === 'Point'"
  },
  {
    "row": "a0337",
    "operand": "g?.type"
  },
  {
    "row": "a0338",
    "operand": "position(g.coordinates)"
  },
  {
    "row": "a0339",
    "operand": "g.coordinates"
  },
  {
    "row": "a0340",
    "operand": "g?.type === 'LineString'"
  },
  {
    "row": "a0341",
    "operand": "g?.type"
  },
  {
    "row": "a0342",
    "operand": "line(g.coordinates)"
  },
  {
    "row": "a0343",
    "operand": "g.coordinates"
  },
  {
    "row": "a0344",
    "operand": "g?.type === 'Polygon' &&\n      Array.isArray(g.coordinates) &&\n      g.coordinates.length"
  },
  {
    "row": "a0345",
    "operand": "g.coordinates.length <= 128"
  },
  {
    "row": "a0346",
    "operand": "g?.type === 'Polygon' &&\n      Array.isArray(g.coordinates)"
  },
  {
    "row": "a0347",
    "operand": "g.coordinates.length"
  },
  {
    "row": "a0348",
    "operand": "g?.type === 'Polygon'"
  },
  {
    "row": "a0349",
    "operand": "Array.isArray(g.coordinates)"
  },
  {
    "row": "a0350",
    "operand": "g?.type === 'Polygon'"
  },
  {
    "row": "a0351",
    "operand": "g?.type"
  },
  {
    "row": "a0352",
    "operand": "Array.isArray(g.coordinates)"
  },
  {
    "row": "a0353",
    "operand": "g.coordinates"
  },
  {
    "row": "a0354",
    "operand": "g.coordinates.length <= 128"
  },
  {
    "row": "a0355",
    "operand": "g.coordinates.map((ring) => line(ring, true))"
  },
  {
    "row": "a0356",
    "operand": "(ring) => line(ring, true)"
  },
  {
    "row": "a0357",
    "operand": "line(ring, true)"
  },
  {
    "row": "a0358",
    "operand": "ring"
  },
  {
    "row": "a0359",
    "operand": "true"
  },
  {
    "row": "a0360",
    "operand": "new Error('Unsupported geometry')"
  },
  {
    "row": "a0361",
    "operand": "'Unsupported geometry'"
  },
  {
    "row": "a0362",
    "operand": "late = () => {}"
  },
  {
    "row": "a0363",
    "operand": "new Promise((resolve, reject) => {\n    let ended = false;\n    const abort = () => {\n      if (!ended) {\n        ended = true;\n        reject(signal.reason);\n      }\n    };\n    signal.addEventListener('abort', abort, { once: true });\n    if (signal.aborted) abort();\n    Promise.resolve(promise).then(\n      (value) => {\n        signal.removeEventListener('abort', abort);\n        if (ended) late(value);\n        else {\n          ended = true;\n          resolve(value);\n        }\n      },\n      (error) => {\n        signal.removeEventListener('abort', abort);\n        if (!ended) {\n          ended = true;\n          reject(error);\n        }\n      },\n    );\n  })"
  },
  {
    "row": "a0364",
    "operand": "(resolve, reject) => {\n    let ended = false;\n    const abort = () => {\n      if (!ended) {\n        ended = true;\n        reject(signal.reason);\n      }\n    };\n    signal.addEventListener('abort', abort, { once: true });\n    if (signal.aborted) abort();\n    Promise.resolve(promise).then(\n      (value) => {\n        signal.removeEventListener('abort', abort);\n        if (ended) late(value);\n        else {\n          ended = true;\n          resolve(value);\n        }\n      },\n      (error) => {\n        signal.removeEventListener('abort', abort);\n        if (!ended) {\n          ended = true;\n          reject(error);\n        }\n      },\n    );\n  }"
  },
  {
    "row": "a0365",
    "operand": "false"
  },
  {
    "row": "a0366",
    "operand": "reject(signal.reason)"
  },
  {
    "row": "a0367",
    "operand": "signal.reason"
  },
  {
    "row": "a0368",
    "operand": "signal.addEventListener('abort', abort, { once: true })"
  },
  {
    "row": "a0369",
    "operand": "'abort'"
  },
  {
    "row": "a0370",
    "operand": "abort"
  },
  {
    "row": "a0371",
    "operand": "{ once: true }"
  },
  {
    "row": "a0372",
    "operand": "true"
  },
  {
    "row": "a0373",
    "operand": "abort()"
  },
  {
    "row": "a0374",
    "operand": "Promise.resolve(promise).then(\n      (value) => {\n        signal.removeEventListener('abort', abort);\n        if (ended) late(value);\n        else {\n          ended = true;\n          resolve(value);\n        }\n      },\n      (error) => {\n        signal.removeEventListener('abort', abort);\n        if (!ended) {\n          ended = true;\n          reject(error);\n        }\n      },\n    )"
  },
  {
    "row": "a0375",
    "operand": "(value) => {\n        signal.removeEventListener('abort', abort);\n        if (ended) late(value);\n        else {\n          ended = true;\n          resolve(value);\n        }\n      }"
  },
  {
    "row": "a0376",
    "operand": "(error) => {\n        signal.removeEventListener('abort', abort);\n        if (!ended) {\n          ended = true;\n          reject(error);\n        }\n      }"
  },
  {
    "row": "a0377",
    "operand": "Promise.resolve(promise)"
  },
  {
    "row": "a0378",
    "operand": "promise"
  },
  {
    "row": "a0379",
    "operand": "signal.removeEventListener('abort', abort)"
  },
  {
    "row": "a0380",
    "operand": "'abort'"
  },
  {
    "row": "a0381",
    "operand": "abort"
  },
  {
    "row": "a0382",
    "operand": "late(value)"
  },
  {
    "row": "a0383",
    "operand": "value"
  },
  {
    "row": "a0384",
    "operand": "resolve(value)"
  },
  {
    "row": "a0385",
    "operand": "value"
  },
  {
    "row": "a0386",
    "operand": "signal.removeEventListener('abort', abort)"
  },
  {
    "row": "a0387",
    "operand": "'abort'"
  },
  {
    "row": "a0388",
    "operand": "abort"
  },
  {
    "row": "a0389",
    "operand": "reject(error)"
  },
  {
    "row": "a0390",
    "operand": "error"
  },
  {
    "row": "a0391",
    "operand": "{\n  sources = {},\n  adapters = {},\n  timeoutMs = 15000,\n} = {}"
  },
  {
    "row": "a0392",
    "operand": "sources = {}"
  },
  {
    "row": "a0393",
    "operand": "adapters = {}"
  },
  {
    "row": "a0394",
    "operand": "timeoutMs = 15000"
  },
  {
    "row": "a0395",
    "operand": "new Map(Object.entries(sources))"
  },
  {
    "row": "a0396",
    "operand": "Object.entries(sources)"
  },
  {
    "row": "a0397",
    "operand": "Object.entries(sources)"
  },
  {
    "row": "a0398",
    "operand": "sources"
  },
  {
    "row": "a0399",
    "operand": "new Map(Object.entries(adapters))"
  },
  {
    "row": "a0400",
    "operand": "Object.entries(adapters)"
  },
  {
    "row": "a0401",
    "operand": "Object.entries(adapters)"
  },
  {
    "row": "a0402",
    "operand": "adapters"
  },
  {
    "row": "a0403",
    "operand": "null"
  },
  {
    "row": "a0404",
    "operand": "false"
  },
  {
    "row": "a0405",
    "operand": "run.controller.abort()"
  },
  {
    "row": "a0406",
    "operand": "run.detach()"
  },
  {
    "row": "a0407",
    "operand": "clearTimeout(run.timer)"
  },
  {
    "row": "a0408",
    "operand": "run.timer"
  },
  {
    "row": "a0409",
    "operand": "run.handles.splice(0).reverse()"
  },
  {
    "row": "a0410",
    "operand": "run.handles.splice(0)"
  },
  {
    "row": "a0411",
    "operand": "0"
  },
  {
    "row": "a0412",
    "operand": "handle.dispose()"
  },
  {
    "row": "a0413",
    "operand": "clear()"
  },
  {
    "row": "a0414",
    "operand": "active?.status"
  },
  {
    "row": "a0415",
    "operand": "'idle'"
  },
  {
    "row": "a0416",
    "operand": "active?.status"
  },
  {
    "row": "a0417",
    "operand": "active?.handles.length"
  },
  {
    "row": "a0418",
    "operand": "0"
  },
  {
    "row": "a0419",
    "operand": "active?.handles.length"
  },
  {
    "row": "a0420",
    "operand": "active?.handles"
  },
  {
    "row": "a0421",
    "operand": "{ anchors = [], signal } = {}"
  },
  {
    "row": "a0422",
    "operand": "anchors = []"
  },
  {
    "row": "a0423",
    "operand": "clear()"
  },
  {
    "row": "a0424",
    "operand": "!Array.isArray(packs)"
  },
  {
    "row": "a0425",
    "operand": "packs.length > PACK_LIMITS.packs"
  },
  {
    "row": "a0426",
    "operand": "Array.isArray(packs)"
  },
  {
    "row": "a0427",
    "operand": "packs"
  },
  {
    "row": "a0428",
    "operand": "packs.length > PACK_LIMITS.packs"
  },
  {
    "row": "a0429",
    "operand": "new Error('Too many data packs')"
  },
  {
    "row": "a0430",
    "operand": "'Too many data packs'"
  },
  {
    "row": "a0431",
    "operand": "new Set(anchors.map((anchor) => anchor.id))"
  },
  {
    "row": "a0432",
    "operand": "anchors.map((anchor) => anchor.id)"
  },
  {
    "row": "a0433",
    "operand": "anchors.map((anchor) => anchor.id)"
  },
  {
    "row": "a0434",
    "operand": "(anchor) => anchor.id"
  },
  {
    "row": "a0435",
    "operand": "packs.forEach((pack, i) =>\n        validateDataPack(pack, `packs[${i}]`, anchorIds),\n      )"
  },
  {
    "row": "a0436",
    "operand": "(pack, i) =>\n        validateDataPack(pack, `packs[${i}]`, anchorIds)"
  },
  {
    "row": "a0437",
    "operand": "validateDataPack(pack, `packs[${i}]`, anchorIds)"
  },
  {
    "row": "a0438",
    "operand": "pack"
  },
  {
    "row": "a0439",
    "operand": "`packs[${i}]`"
  },
  {
    "row": "a0440",
    "operand": "anchorIds"
  },
  {
    "row": "a0441",
    "operand": "disposed"
  },
  {
    "row": "a0442",
    "operand": "signal?.aborted"
  },
  {
    "row": "a0443",
    "operand": "signal?.aborted"
  },
  {
    "row": "a0444",
    "operand": "new AbortController()"
  },
  {
    "row": "a0445",
    "operand": "{\n        controller,\n        handles: [],\n        status: 'loading',\n        detach: () => signal?.removeEventListener('abort', cancel),\n      }"
  },
  {
    "row": "a0446",
    "operand": "[]"
  },
  {
    "row": "a0447",
    "operand": "'loading'"
  },
  {
    "row": "a0448",
    "operand": "signal?.removeEventListener('abort', cancel)"
  },
  {
    "row": "a0449",
    "operand": "signal?.removeEventListener('abort', cancel)"
  },
  {
    "row": "a0450",
    "operand": "'abort'"
  },
  {
    "row": "a0451",
    "operand": "cancel"
  },
  {
    "row": "a0452",
    "operand": "signal?.removeEventListener"
  },
  {
    "row": "a0453",
    "operand": "active === run"
  },
  {
    "row": "a0454",
    "operand": "clear()"
  },
  {
    "row": "a0455",
    "operand": "signal?.addEventListener('abort', cancel, { once: true })"
  },
  {
    "row": "a0456",
    "operand": "signal?.addEventListener('abort', cancel, { once: true })"
  },
  {
    "row": "a0457",
    "operand": "'abort'"
  },
  {
    "row": "a0458",
    "operand": "cancel"
  },
  {
    "row": "a0459",
    "operand": "{ once: true }"
  },
  {
    "row": "a0460",
    "operand": "signal?.addEventListener"
  },
  {
    "row": "a0461",
    "operand": "true"
  },
  {
    "row": "a0462",
    "operand": "setTimeout(\n        () => controller.abort(new Error('Asset load timed out')),\n        timeoutMs,\n      )"
  },
  {
    "row": "a0463",
    "operand": "() => controller.abort(new Error('Asset load timed out'))"
  },
  {
    "row": "a0464",
    "operand": "timeoutMs"
  },
  {
    "row": "a0465",
    "operand": "controller.abort(new Error('Asset load timed out'))"
  },
  {
    "row": "a0466",
    "operand": "new Error('Asset load timed out')"
  },
  {
    "row": "a0467",
    "operand": "new Error('Asset load timed out')"
  },
  {
    "row": "a0468",
    "operand": "'Asset load timed out'"
  },
  {
    "row": "a0469",
    "operand": "0"
  },
  {
    "row": "a0470",
    "operand": "sourceMap.get(pack.source.adapter)"
  },
  {
    "row": "a0471",
    "operand": "pack.source.adapter"
  },
  {
    "row": "a0472",
    "operand": "adapterMap.get(pack.format)"
  },
  {
    "row": "a0473",
    "operand": "pack.format"
  },
  {
    "row": "a0474",
    "operand": "!source"
  },
  {
    "row": "a0475",
    "operand": "!adapter"
  },
  {
    "row": "a0476",
    "operand": "new Error('Data pack adapter unavailable')"
  },
  {
    "row": "a0477",
    "operand": "'Data pack adapter unavailable'"
  },
  {
    "row": "a0478",
    "operand": "untilAbort(\n            source({\n              path: pack.source.path,\n              signal: controller.signal,\n              maxBytes: pack.byteLength || PACK_LIMITS.bytes,\n            }),\n            controller.signal,\n          )"
  },
  {
    "row": "a0479",
    "operand": "source({\n              path: pack.source.path,\n              signal: controller.signal,\n              maxBytes: pack.byteLength || PACK_LIMITS.bytes,\n            })"
  },
  {
    "row": "a0480",
    "operand": "controller.signal"
  },
  {
    "row": "a0481",
    "operand": "source({\n              path: pack.source.path,\n              signal: controller.signal,\n              maxBytes: pack.byteLength || PACK_LIMITS.bytes,\n            })"
  },
  {
    "row": "a0482",
    "operand": "{\n              path: pack.source.path,\n              signal: controller.signal,\n              maxBytes: pack.byteLength || PACK_LIMITS.bytes,\n            }"
  },
  {
    "row": "a0483",
    "operand": "pack.byteLength"
  },
  {
    "row": "a0484",
    "operand": "PACK_LIMITS.bytes"
  },
  {
    "row": "a0485",
    "operand": "controller.signal.throwIfAborted()"
  },
  {
    "row": "a0486",
    "operand": "!(bytes instanceof Uint8Array) ||\n            !bytes.length ||\n            bytes.length > PACK_LIMITS.bytes"
  },
  {
    "row": "a0487",
    "operand": "pack.byteLength && bytes.length !== pack.byteLength"
  },
  {
    "row": "a0488",
    "operand": "!(bytes instanceof Uint8Array) ||\n            !bytes.length"
  },
  {
    "row": "a0489",
    "operand": "bytes.length > PACK_LIMITS.bytes"
  },
  {
    "row": "a0490",
    "operand": "!(bytes instanceof Uint8Array)"
  },
  {
    "row": "a0491",
    "operand": "!bytes.length"
  },
  {
    "row": "a0492",
    "operand": "bytes.length > PACK_LIMITS.bytes"
  },
  {
    "row": "a0493",
    "operand": "pack.byteLength"
  },
  {
    "row": "a0494",
    "operand": "bytes.length !== pack.byteLength"
  },
  {
    "row": "a0495",
    "operand": "bytes.length !== pack.byteLength"
  },
  {
    "row": "a0496",
    "operand": "new Error('Asset byte length invalid')"
  },
  {
    "row": "a0497",
    "operand": "'Asset byte length invalid'"
  },
  {
    "row": "a0498",
    "operand": "total > PACK_LIMITS.totalBytes"
  },
  {
    "row": "a0499",
    "operand": "new Error('Shot assets exceed byte limit')"
  },
  {
    "row": "a0500",
    "operand": "'Shot assets exceed byte limit'"
  },
  {
    "row": "a0501",
    "operand": "untilAbort(\n              crypto.subtle.digest('SHA-256', bytes),\n              controller.signal,\n            )"
  },
  {
    "row": "a0502",
    "operand": "crypto.subtle.digest('SHA-256', bytes)"
  },
  {
    "row": "a0503",
    "operand": "controller.signal"
  },
  {
    "row": "a0504",
    "operand": "crypto.subtle.digest('SHA-256', bytes)"
  },
  {
    "row": "a0505",
    "operand": "'SHA-256'"
  },
  {
    "row": "a0506",
    "operand": "bytes"
  },
  {
    "row": "a0507",
    "operand": "Array.from(new Uint8Array(digest), (b) =>\n              b.toString(16).padStart(2, '0'),\n            ).join('')"
  },
  {
    "row": "a0508",
    "operand": "''"
  },
  {
    "row": "a0509",
    "operand": "Array.from(new Uint8Array(digest), (b) =>\n              b.toString(16).padStart(2, '0'),\n            )"
  },
  {
    "row": "a0510",
    "operand": "new Uint8Array(digest)"
  },
  {
    "row": "a0511",
    "operand": "(b) =>\n              b.toString(16).padStart(2, '0')"
  },
  {
    "row": "a0512",
    "operand": "new Uint8Array(digest)"
  },
  {
    "row": "a0513",
    "operand": "digest"
  },
  {
    "row": "a0514",
    "operand": "b.toString(16).padStart(2, '0')"
  },
  {
    "row": "a0515",
    "operand": "2"
  },
  {
    "row": "a0516",
    "operand": "'0'"
  },
  {
    "row": "a0517",
    "operand": "b.toString(16)"
  },
  {
    "row": "a0518",
    "operand": "16"
  },
  {
    "row": "a0519",
    "operand": "hex !== pack.sha256"
  },
  {
    "row": "a0520",
    "operand": "new Error('Asset integrity mismatch')"
  },
  {
    "row": "a0521",
    "operand": "'Asset integrity mismatch'"
  },
  {
    "row": "a0522",
    "operand": "untilAbort(\n            adapter({ pack, asset, anchors, signal: controller.signal }),\n            controller.signal,\n            (late) => late?.dispose(),\n          )"
  },
  {
    "row": "a0523",
    "operand": "adapter({ pack, asset, anchors, signal: controller.signal })"
  },
  {
    "row": "a0524",
    "operand": "controller.signal"
  },
  {
    "row": "a0525",
    "operand": "(late) => late?.dispose()"
  },
  {
    "row": "a0526",
    "operand": "adapter({ pack, asset, anchors, signal: controller.signal })"
  },
  {
    "row": "a0527",
    "operand": "{ pack, asset, anchors, signal: controller.signal }"
  },
  {
    "row": "a0528",
    "operand": "late?.dispose()"
  },
  {
    "row": "a0529",
    "operand": "late?.dispose()"
  },
  {
    "row": "a0530",
    "operand": "late?.dispose"
  },
  {
    "row": "a0531",
    "operand": "!handle"
  },
  {
    "row": "a0532",
    "operand": "typeof handle.dispose !== 'function'"
  },
  {
    "row": "a0533",
    "operand": "typeof handle.dispose !== 'function'"
  },
  {
    "row": "a0534",
    "operand": "new Error('Data pack adapter requires disposal')"
  },
  {
    "row": "a0535",
    "operand": "'Data pack adapter requires disposal'"
  },
  {
    "row": "a0536",
    "operand": "active !== run"
  },
  {
    "row": "a0537",
    "operand": "controller.signal.aborted"
  },
  {
    "row": "a0538",
    "operand": "active !== run"
  },
  {
    "row": "a0539",
    "operand": "handle.dispose()"
  },
  {
    "row": "a0540",
    "operand": "controller.signal.throwIfAborted()"
  },
  {
    "row": "a0541",
    "operand": "run.handles.push(handle)"
  },
  {
    "row": "a0542",
    "operand": "handle"
  },
  {
    "row": "a0543",
    "operand": "controller.signal.throwIfAborted()"
  },
  {
    "row": "a0544",
    "operand": "clearTimeout(run.timer)"
  },
  {
    "row": "a0545",
    "operand": "run.timer"
  },
  {
    "row": "a0546",
    "operand": "active !== run || signal?.aborted"
  },
  {
    "row": "a0547",
    "operand": "disposed"
  },
  {
    "row": "a0548",
    "operand": "active !== run"
  },
  {
    "row": "a0549",
    "operand": "signal?.aborted"
  },
  {
    "row": "a0550",
    "operand": "active !== run"
  },
  {
    "row": "a0551",
    "operand": "signal?.aborted"
  },
  {
    "row": "a0552",
    "operand": "active === run"
  },
  {
    "row": "a0553",
    "operand": "clear()"
  },
  {
    "row": "a0554",
    "operand": "new Error(\n          'Data pack could not load: check its source, format, size or integrity',\n        )"
  },
  {
    "row": "a0555",
    "operand": "'Data pack could not load: check its source, format, size or integrity'"
  },
  {
    "row": "a0556",
    "operand": "fetchImpl = globalThis.fetch"
  },
  {
    "row": "a0557",
    "operand": "new URL(baseUrl)"
  },
  {
    "row": "a0558",
    "operand": "baseUrl"
  },
  {
    "row": "a0559",
    "operand": "!['https:', 'http:'].includes(base.protocol) ||\n    base.username ||\n    base.password ||\n    base.search ||\n    base.hash"
  },
  {
    "row": "a0560",
    "operand": "!base.pathname.endsWith('/')"
  },
  {
    "row": "a0561",
    "operand": "!['https:', 'http:'].includes(base.protocol) ||\n    base.username ||\n    base.password ||\n    base.search"
  },
  {
    "row": "a0562",
    "operand": "base.hash"
  },
  {
    "row": "a0563",
    "operand": "!['https:', 'http:'].includes(base.protocol) ||\n    base.username ||\n    base.password"
  },
  {
    "row": "a0564",
    "operand": "base.search"
  },
  {
    "row": "a0565",
    "operand": "!['https:', 'http:'].includes(base.protocol) ||\n    base.username"
  },
  {
    "row": "a0566",
    "operand": "base.password"
  },
  {
    "row": "a0567",
    "operand": "!['https:', 'http:'].includes(base.protocol)"
  },
  {
    "row": "a0568",
    "operand": "base.username"
  },
  {
    "row": "a0569",
    "operand": "['https:', 'http:'].includes(base.protocol)"
  },
  {
    "row": "a0570",
    "operand": "base.protocol"
  },
  {
    "row": "a0571",
    "operand": "base.pathname.endsWith('/')"
  },
  {
    "row": "a0572",
    "operand": "'/'"
  },
  {
    "row": "a0573",
    "operand": "new TypeError(\n      'Asset source requires an explicit HTTP(S) directory URL',\n    )"
  },
  {
    "row": "a0574",
    "operand": "'Asset source requires an explicit HTTP(S) directory URL'"
  },
  {
    "row": "a0575",
    "operand": "maxBytes = PACK_LIMITS.bytes"
  },
  {
    "row": "a0576",
    "operand": "validateAssetPath(path)"
  },
  {
    "row": "a0577",
    "operand": "path"
  },
  {
    "row": "a0578",
    "operand": "signal?.throwIfAborted()"
  },
  {
    "row": "a0579",
    "operand": "signal?.throwIfAborted()"
  },
  {
    "row": "a0580",
    "operand": "signal?.throwIfAborted"
  },
  {
    "row": "a0581",
    "operand": "fetchImpl(new URL(path, base).href, {\n      signal,\n      credentials: 'omit',\n      redirect: 'error',\n      referrerPolicy: 'no-referrer',\n      cache: 'no-store',\n    })"
  },
  {
    "row": "a0582",
    "operand": "new URL(path, base).href"
  },
  {
    "row": "a0583",
    "operand": "{\n      signal,\n      credentials: 'omit',\n      redirect: 'error',\n      referrerPolicy: 'no-referrer',\n      cache: 'no-store',\n    }"
  },
  {
    "row": "a0584",
    "operand": "new URL(path, base)"
  },
  {
    "row": "a0585",
    "operand": "path"
  },
  {
    "row": "a0586",
    "operand": "base"
  },
  {
    "row": "a0587",
    "operand": "'omit'"
  },
  {
    "row": "a0588",
    "operand": "'error'"
  },
  {
    "row": "a0589",
    "operand": "'no-referrer'"
  },
  {
    "row": "a0590",
    "operand": "'no-store'"
  },
  {
    "row": "a0591",
    "operand": "response.body?.cancel().catch(() => {})"
  },
  {
    "row": "a0592",
    "operand": "response.body?.cancel().catch(() => {})"
  },
  {
    "row": "a0593",
    "operand": "() => {}"
  },
  {
    "row": "a0594",
    "operand": "response.body?.cancel().catch"
  },
  {
    "row": "a0595",
    "operand": "response.body?.cancel()"
  },
  {
    "row": "a0596",
    "operand": "response.body?.cancel()"
  },
  {
    "row": "a0597",
    "operand": "response.body?.cancel"
  },
  {
    "row": "a0598",
    "operand": "new Error('Asset unavailable')"
  },
  {
    "row": "a0599",
    "operand": "'Asset unavailable'"
  },
  {
    "row": "a0600",
    "operand": "response.body?.getReader()"
  },
  {
    "row": "a0601",
    "operand": "response.body?.getReader()"
  },
  {
    "row": "a0602",
    "operand": "response.body?.getReader"
  },
  {
    "row": "a0603",
    "operand": "new Error('Asset stream unavailable')"
  },
  {
    "row": "a0604",
    "operand": "'Asset stream unavailable'"
  },
  {
    "row": "a0605",
    "operand": "[]"
  },
  {
    "row": "a0606",
    "operand": "0"
  },
  {
    "row": "a0607",
    "operand": "Number(response.headers.get('content-length')) > maxBytes"
  },
  {
    "row": "a0608",
    "operand": "Number(response.headers.get('content-length'))"
  },
  {
    "row": "a0609",
    "operand": "response.headers.get('content-length')"
  },
  {
    "row": "a0610",
    "operand": "response.headers.get('content-length')"
  },
  {
    "row": "a0611",
    "operand": "'content-length'"
  },
  {
    "row": "a0612",
    "operand": "new Error('Asset exceeds byte limit')"
  },
  {
    "row": "a0613",
    "operand": "'Asset exceeds byte limit'"
  },
  {
    "row": "a0614",
    "operand": "signal?.throwIfAborted()"
  },
  {
    "row": "a0615",
    "operand": "signal?.throwIfAborted()"
  },
  {
    "row": "a0616",
    "operand": "signal?.throwIfAborted"
  },
  {
    "row": "a0617",
    "operand": "reader.read()"
  },
  {
    "row": "a0618",
    "operand": "length > maxBytes"
  },
  {
    "row": "a0619",
    "operand": "new Error('Asset exceeds byte limit')"
  },
  {
    "row": "a0620",
    "operand": "'Asset exceeds byte limit'"
  },
  {
    "row": "a0621",
    "operand": "chunks.push(value)"
  },
  {
    "row": "a0622",
    "operand": "value"
  },
  {
    "row": "a0623",
    "operand": "reader.cancel().catch(() => {})"
  },
  {
    "row": "a0624",
    "operand": "() => {}"
  },
  {
    "row": "a0625",
    "operand": "reader.cancel()"
  },
  {
    "row": "a0626",
    "operand": "reader.releaseLock()"
  },
  {
    "row": "a0627",
    "operand": "new Uint8Array(length)"
  },
  {
    "row": "a0628",
    "operand": "length"
  },
  {
    "row": "a0629",
    "operand": "0"
  },
  {
    "row": "a0630",
    "operand": "bytes.set(chunk, offset)"
  },
  {
    "row": "a0631",
    "operand": "chunk"
  },
  {
    "row": "a0632",
    "operand": "offset"
  },
  {
    "row": "a0633",
    "operand": "(response.headers.get('content-type') || '')\n        .split(';')[0]\n        .trim()\n        .toLowerCase()"
  },
  {
    "row": "a0634",
    "operand": "(response.headers.get('content-type') || '')\n        .split(';')[0]\n        .trim()"
  },
  {
    "row": "a0635",
    "operand": "(response.headers.get('content-type') || '')\n        .split(';')"
  },
  {
    "row": "a0636",
    "operand": "';'"
  },
  {
    "row": "a0637",
    "operand": "response.headers.get('content-type')"
  },
  {
    "row": "a0638",
    "operand": "''"
  },
  {
    "row": "a0639",
    "operand": "response.headers.get('content-type')"
  },
  {
    "row": "a0640",
    "operand": "'content-type'"
  },
  {
    "row": "a0641",
    "operand": "'scene-bundle'"
  },
  {
    "row": "a0642",
    "operand": "Object.freeze({\n  bytes: 50 * 1024 * 1024,\n  assets: 64,\n})"
  },
  {
    "row": "a0643",
    "operand": "{\n  bytes: 50 * 1024 * 1024,\n  assets: 64,\n}"
  },
  {
    "row": "a0644",
    "operand": "64"
  },
  {
    "row": "a0645",
    "operand": "new Set([\n  'application/json',\n  'application/geo+json',\n  'image/png',\n  'video/mp4',\n  'video/webm',\n  'audio/mpeg',\n  'audio/ogg',\n  'audio/wav',\n  'audio/webm',\n])"
  },
  {
    "row": "a0646",
    "operand": "[\n  'application/json',\n  'application/geo+json',\n  'image/png',\n  'video/mp4',\n  'video/webm',\n  'audio/mpeg',\n  'audio/ogg',\n  'audio/wav',\n  'audio/webm',\n]"
  },
  {
    "row": "a0647",
    "operand": "project.scenes.flatMap((scene) => scene.dataPacks || [])"
  },
  {
    "row": "a0648",
    "operand": "(scene) => scene.dataPacks || []"
  },
  {
    "row": "a0649",
    "operand": "scene.dataPacks"
  },
  {
    "row": "a0650",
    "operand": "[]"
  },
  {
    "row": "a0651",
    "operand": "signal?.throwIfAborted()"
  },
  {
    "row": "a0652",
    "operand": "signal?.throwIfAborted()"
  },
  {
    "row": "a0653",
    "operand": "signal?.throwIfAborted"
  },
  {
    "row": "a0654",
    "operand": "Array.from(\n    new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),\n    (n) => n.toString(16).padStart(2, '0'),\n  ).join('')"
  },
  {
    "row": "a0655",
    "operand": "''"
  },
  {
    "row": "a0656",
    "operand": "Array.from(\n    new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)),\n    (n) => n.toString(16).padStart(2, '0'),\n  )"
  },
  {
    "row": "a0657",
    "operand": "new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))"
  },
  {
    "row": "a0658",
    "operand": "(n) => n.toString(16).padStart(2, '0')"
  },
  {
    "row": "a0659",
    "operand": "new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))"
  },
  {
    "row": "a0660",
    "operand": "await crypto.subtle.digest('SHA-256', bytes)"
  },
  {
    "row": "a0661",
    "operand": "crypto.subtle.digest('SHA-256', bytes)"
  },
  {
    "row": "a0662",
    "operand": "'SHA-256'"
  },
  {
    "row": "a0663",
    "operand": "bytes"
  },
  {
    "row": "a0664",
    "operand": "n.toString(16).padStart(2, '0')"
  },
  {
    "row": "a0665",
    "operand": "2"
  },
  {
    "row": "a0666",
    "operand": "'0'"
  },
  {
    "row": "a0667",
    "operand": "n.toString(16)"
  },
  {
    "row": "a0668",
    "operand": "16"
  },
  {
    "row": "a0669",
    "operand": "[]"
  },
  {
    "row": "a0670",
    "operand": "0"
  },
  {
    "row": "a0671",
    "operand": "i < bytes.length"
  },
  {
    "row": "a0672",
    "operand": "chunks.push(String.fromCharCode(...bytes.subarray(i, i + 32768)))"
  },
  {
    "row": "a0673",
    "operand": "String.fromCharCode(...bytes.subarray(i, i + 32768))"
  },
  {
    "row": "a0674",
    "operand": "String.fromCharCode(...bytes.subarray(i, i + 32768))"
  },
  {
    "row": "a0675",
    "operand": "...bytes.subarray(i, i + 32768)"
  },
  {
    "row": "a0676",
    "operand": "bytes.subarray(i, i + 32768)"
  },
  {
    "row": "a0677",
    "operand": "i"
  },
  {
    "row": "a0678",
    "operand": "i + 32768"
  },
  {
    "row": "a0679",
    "operand": "btoa(chunks.join(''))"
  },
  {
    "row": "a0680",
    "operand": "chunks.join('')"
  },
  {
    "row": "a0681",
    "operand": "chunks.join('')"
  },
  {
    "row": "a0682",
    "operand": "''"
  },
  {
    "row": "a0683",
    "operand": "typeof value !== 'string' ||\n    !value.length ||\n    value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4 ||\n    value.length % 4 !== 0 ||\n    /[^A-Za-z0-9+/=]/.test(value)"
  },
  {
    "row": "a0684",
    "operand": "value.includes('=') && !/^[A-Za-z0-9+/]+={1,2}$/.test(value)"
  },
  {
    "row": "a0685",
    "operand": "typeof value !== 'string' ||\n    !value.length ||\n    value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4 ||\n    value.length % 4 !== 0"
  },
  {
    "row": "a0686",
    "operand": "/[^A-Za-z0-9+/=]/.test(value)"
  },
  {
    "row": "a0687",
    "operand": "typeof value !== 'string' ||\n    !value.length ||\n    value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4"
  },
  {
    "row": "a0688",
    "operand": "value.length % 4 !== 0"
  },
  {
    "row": "a0689",
    "operand": "typeof value !== 'string' ||\n    !value.length"
  },
  {
    "row": "a0690",
    "operand": "value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4"
  },
  {
    "row": "a0691",
    "operand": "typeof value !== 'string'"
  },
  {
    "row": "a0692",
    "operand": "!value.length"
  },
  {
    "row": "a0693",
    "operand": "typeof value !== 'string'"
  },
  {
    "row": "a0694",
    "operand": "value.length > Math.ceil(PACK_LIMITS.bytes / 3) * 4"
  },
  {
    "row": "a0695",
    "operand": "Math.ceil(PACK_LIMITS.bytes / 3)"
  },
  {
    "row": "a0696",
    "operand": "PACK_LIMITS.bytes / 3"
  },
  {
    "row": "a0697",
    "operand": "value.length % 4 !== 0"
  },
  {
    "row": "a0698",
    "operand": "/[^A-Za-z0-9+/=]/.test(value)"
  },
  {
    "row": "a0699",
    "operand": "value"
  },
  {
    "row": "a0700",
    "operand": "/[^A-Za-z0-9+/=]/"
  },
  {
    "row": "a0701",
    "operand": "[^A-Za-z0-9+/=]"
  },
  {
    "row": "a0702",
    "operand": "value.includes('=')"
  },
  {
    "row": "a0703",
    "operand": "!/^[A-Za-z0-9+/]+={1,2}$/.test(value)"
  },
  {
    "row": "a0704",
    "operand": "value.includes('=')"
  },
  {
    "row": "a0705",
    "operand": "'='"
  },
  {
    "row": "a0706",
    "operand": "/^[A-Za-z0-9+/]+={1,2}$/.test(value)"
  },
  {
    "row": "a0707",
    "operand": "value"
  },
  {
    "row": "a0708",
    "operand": "/^[A-Za-z0-9+/]+={1,2}$/"
  },
  {
    "row": "a0709",
    "operand": "^"
  },
  {
    "row": "a0710",
    "operand": "[A-Za-z0-9+/]"
  },
  {
    "row": "a0711",
    "operand": "$"
  },
  {
    "row": "a0712",
    "operand": "fail('assets', 'invalid or oversized base64 asset')"
  },
  {
    "row": "a0713",
    "operand": "'assets'"
  },
  {
    "row": "a0714",
    "operand": "'invalid or oversized base64 asset'"
  },
  {
    "row": "a0715",
    "operand": "Uint8Array.from(atob(value), (c) => c.charCodeAt(0))"
  },
  {
    "row": "a0716",
    "operand": "atob(value)"
  },
  {
    "row": "a0717",
    "operand": "(c) => c.charCodeAt(0)"
  },
  {
    "row": "a0718",
    "operand": "atob(value)"
  },
  {
    "row": "a0719",
    "operand": "value"
  },
  {
    "row": "a0720",
    "operand": "c.charCodeAt(0)"
  },
  {
    "row": "a0721",
    "operand": "0"
  },
  {
    "row": "a0722",
    "operand": "!(bytes instanceof Uint8Array) ||\n    !bytes.length ||\n    bytes.length > PACK_LIMITS.bytes"
  },
  {
    "row": "a0723",
    "operand": "total > PACK_LIMITS.totalBytes"
  },
  {
    "row": "a0724",
    "operand": "!(bytes instanceof Uint8Array) ||\n    !bytes.length"
  },
  {
    "row": "a0725",
    "operand": "bytes.length > PACK_LIMITS.bytes"
  },
  {
    "row": "a0726",
    "operand": "!(bytes instanceof Uint8Array)"
  },
  {
    "row": "a0727",
    "operand": "!bytes.length"
  },
  {
    "row": "a0728",
    "operand": "bytes.length > PACK_LIMITS.bytes"
  },
  {
    "row": "a0729",
    "operand": "total > PACK_LIMITS.totalBytes"
  },
  {
    "row": "a0730",
    "operand": "fail('assets', 'asset byte limit exceeded')"
  },
  {
    "row": "a0731",
    "operand": "'assets'"
  },
  {
    "row": "a0732",
    "operand": "'asset byte limit exceeded'"
  },
  {
    "row": "a0733",
    "operand": "MIME.has(mimeType)"
  },
  {
    "row": "a0734",
    "operand": "mimeType"
  },
  {
    "row": "a0735",
    "operand": "fail('assets', 'unsupported media type')"
  },
  {
    "row": "a0736",
    "operand": "'assets'"
  },
  {
    "row": "a0737",
    "operand": "'unsupported media type'"
  },
  {
    "row": "a0738",
    "operand": "{ signal } = {}"
  },
  {
    "row": "a0739",
    "operand": "checkAbort(signal)"
  },
  {
    "row": "a0740",
    "operand": "signal"
  },
  {
    "row": "a0741",
    "operand": "typeof text !== 'string' ||\n    text.length > SHARE_LIMITS.bytes"
  },
  {
    "row": "a0742",
    "operand": "new TextEncoder().encode(text).length > SHARE_LIMITS.bytes"
  },
  {
    "row": "a0743",
    "operand": "typeof text !== 'string'"
  },
  {
    "row": "a0744",
    "operand": "text.length > SHARE_LIMITS.bytes"
  },
  {
    "row": "a0745",
    "operand": "typeof text !== 'string'"
  },
  {
    "row": "a0746",
    "operand": "text.length > SHARE_LIMITS.bytes"
  },
  {
    "row": "a0747",
    "operand": "new TextEncoder().encode(text).length > SHARE_LIMITS.bytes"
  },
  {
    "row": "a0748",
    "operand": "new TextEncoder().encode(text)"
  },
  {
    "row": "a0749",
    "operand": "text"
  },
  {
    "row": "a0750",
    "operand": "new TextEncoder()"
  },
  {
    "row": "a0751",
    "operand": "fail('$', 'share exceeds 50 MiB')"
  },
  {
    "row": "a0752",
    "operand": "'$'"
  },
  {
    "row": "a0753",
    "operand": "'share exceeds 50 MiB'"
  },
  {
    "row": "a0754",
    "operand": "JSON.parse(text)"
  },
  {
    "row": "a0755",
    "operand": "text"
  },
  {
    "row": "a0756",
    "operand": "fail('$', 'invalid JSON')"
  },
  {
    "row": "a0757",
    "operand": "'$'"
  },
  {
    "row": "a0758",
    "operand": "'invalid JSON'"
  },
  {
    "row": "a0759",
    "operand": "input?.format !== 'gev-scene-bundle'"
  },
  {
    "row": "a0760",
    "operand": "input?.format"
  },
  {
    "row": "a0761",
    "operand": "parseSceneDocument(text)"
  },
  {
    "row": "a0762",
    "operand": "text"
  },
  {
    "row": "a0763",
    "operand": "new Map()"
  },
  {
    "row": "a0764",
    "operand": "fields(input, '$', ['format', 'version', 'project', 'assets'])"
  },
  {
    "row": "a0765",
    "operand": "input"
  },
  {
    "row": "a0766",
    "operand": "'$'"
  },
  {
    "row": "a0767",
    "operand": "['format', 'version', 'project', 'assets']"
  },
  {
    "row": "a0768",
    "operand": "input.version !== 1"
  },
  {
    "row": "a0769",
    "operand": "fail('version', 'unsupported bundle version')"
  },
  {
    "row": "a0770",
    "operand": "'version'"
  },
  {
    "row": "a0771",
    "operand": "'unsupported bundle version'"
  },
  {
    "row": "a0772",
    "operand": "parseSceneDocument(JSON.stringify(input.project))"
  },
  {
    "row": "a0773",
    "operand": "JSON.stringify(input.project)"
  },
  {
    "row": "a0774",
    "operand": "JSON.stringify(input.project)"
  },
  {
    "row": "a0775",
    "operand": "input.project"
  },
  {
    "row": "a0776",
    "operand": "array(input.assets, 'assets', SHARE_LIMITS.assets)"
  },
  {
    "row": "a0777",
    "operand": "input.assets"
  },
  {
    "row": "a0778",
    "operand": "'assets'"
  },
  {
    "row": "a0779",
    "operand": "SHARE_LIMITS.assets"
  },
  {
    "row": "a0780",
    "operand": "new Map()"
  },
  {
    "row": "a0781",
    "operand": "0"
  },
  {
    "row": "a0782",
    "operand": "checkAbort(signal)"
  },
  {
    "row": "a0783",
    "operand": "signal"
  },
  {
    "row": "a0784",
    "operand": "fields(entry, 'assets', ['path', 'mimeType', 'base64', 'sha256'])"
  },
  {
    "row": "a0785",
    "operand": "entry"
  },
  {
    "row": "a0786",
    "operand": "'assets'"
  },
  {
    "row": "a0787",
    "operand": "['path', 'mimeType', 'base64', 'sha256']"
  },
  {
    "row": "a0788",
    "operand": "validateAssetPath(entry.path)"
  },
  {
    "row": "a0789",
    "operand": "entry.path"
  },
  {
    "row": "a0790",
    "operand": "checkMime(entry.mimeType)"
  },
  {
    "row": "a0791",
    "operand": "entry.mimeType"
  },
  {
    "row": "a0792",
    "operand": "assets.has(entry.path)"
  },
  {
    "row": "a0793",
    "operand": "entry.path"
  },
  {
    "row": "a0794",
    "operand": "fail('assets', 'duplicate asset path')"
  },
  {
    "row": "a0795",
    "operand": "'assets'"
  },
  {
    "row": "a0796",
    "operand": "'duplicate asset path'"
  },
  {
    "row": "a0797",
    "operand": "decode(entry.base64)"
  },
  {
    "row": "a0798",
    "operand": "entry.base64"
  },
  {
    "row": "a0799",
    "operand": "checkBytes(bytes, total)"
  },
  {
    "row": "a0800",
    "operand": "bytes"
  },
  {
    "row": "a0801",
    "operand": "total"
  },
  {
    "row": "a0802",
    "operand": "digest(bytes)"
  },
  {
    "row": "a0803",
    "operand": "bytes"
  },
  {
    "row": "a0804",
    "operand": "checkAbort(signal)"
  },
  {
    "row": "a0805",
    "operand": "signal"
  },
  {
    "row": "a0806",
    "operand": "entry.sha256 !== hash"
  },
  {
    "row": "a0807",
    "operand": "fail('assets', 'asset integrity mismatch')"
  },
  {
    "row": "a0808",
    "operand": "'assets'"
  },
  {
    "row": "a0809",
    "operand": "'asset integrity mismatch'"
  },
  {
    "row": "a0810",
    "operand": "assets.set(entry.path, { bytes, mimeType: entry.mimeType, sha256: hash })"
  },
  {
    "row": "a0811",
    "operand": "entry.path"
  },
  {
    "row": "a0812",
    "operand": "{ bytes, mimeType: entry.mimeType, sha256: hash }"
  },
  {
    "row": "a0813",
    "operand": "new Set()"
  },
  {
    "row": "a0814",
    "operand": "packsOf(project)"
  },
  {
    "row": "a0815",
    "operand": "project"
  },
  {
    "row": "a0816",
    "operand": "pack.source.adapter !== BUNDLE_SOURCE"
  },
  {
    "row": "a0817",
    "operand": "fail('project', 'bundle must include every declared pack')"
  },
  {
    "row": "a0818",
    "operand": "'project'"
  },
  {
    "row": "a0819",
    "operand": "'bundle must include every declared pack'"
  },
  {
    "row": "a0820",
    "operand": "assets.get(pack.source.path)"
  },
  {
    "row": "a0821",
    "operand": "pack.source.path"
  },
  {
    "row": "a0822",
    "operand": "used.add(pack.source.path)"
  },
  {
    "row": "a0823",
    "operand": "pack.source.path"
  },
  {
    "row": "a0824",
    "operand": "!asset ||\n      pack.byteLength !== asset.bytes.length"
  },
  {
    "row": "a0825",
    "operand": "pack.sha256 !== asset.sha256"
  },
  {
    "row": "a0826",
    "operand": "!asset"
  },
  {
    "row": "a0827",
    "operand": "pack.byteLength !== asset.bytes.length"
  },
  {
    "row": "a0828",
    "operand": "pack.byteLength !== asset.bytes.length"
  },
  {
    "row": "a0829",
    "operand": "pack.sha256 !== asset.sha256"
  },
  {
    "row": "a0830",
    "operand": "fail('project', 'missing or mismatched bundle asset')"
  },
  {
    "row": "a0831",
    "operand": "'project'"
  },
  {
    "row": "a0832",
    "operand": "'missing or mismatched bundle asset'"
  },
  {
    "row": "a0833",
    "operand": "used.size !== assets.size"
  },
  {
    "row": "a0834",
    "operand": "fail('assets', 'unreferenced bundle asset')"
  },
  {
    "row": "a0835",
    "operand": "'assets'"
  },
  {
    "row": "a0836",
    "operand": "'unreferenced bundle asset'"
  },
  {
    "row": "a0837",
    "operand": "file.name?.endsWith('.gevbundle.json')"
  },
  {
    "row": "a0838",
    "operand": "SHARE_LIMITS.bytes"
  },
  {
    "row": "a0839",
    "operand": "5 * 1024 * 1024"
  },
  {
    "row": "a0840",
    "operand": "file.name?.endsWith('.gevbundle.json')"
  },
  {
    "row": "a0841",
    "operand": "file.name?.endsWith('.gevbundle.json')"
  },
  {
    "row": "a0842",
    "operand": "'.gevbundle.json'"
  },
  {
    "row": "a0843",
    "operand": "file.name?.endsWith"
  },
  {
    "row": "a0844",
    "operand": "file.size > limit"
  },
  {
    "row": "a0845",
    "operand": "fail(\n      '$',\n      limit === SHARE_LIMITS.bytes\n        ? 'share exceeds 50 MiB'\n        : 'file exceeds 5 MiB',\n    )"
  },
  {
    "row": "a0846",
    "operand": "'$'"
  },
  {
    "row": "a0847",
    "operand": "limit === SHARE_LIMITS.bytes\n        ? 'share exceeds 50 MiB'\n        : 'file exceeds 5 MiB'"
  },
  {
    "row": "a0848",
    "operand": "limit === SHARE_LIMITS.bytes"
  },
  {
    "row": "a0849",
    "operand": "'share exceeds 50 MiB'"
  },
  {
    "row": "a0850",
    "operand": "'file exceeds 5 MiB'"
  },
  {
    "row": "a0851",
    "operand": "limit === SHARE_LIMITS.bytes"
  },
  {
    "row": "a0852",
    "operand": "checkAbort(options?.signal)"
  },
  {
    "row": "a0853",
    "operand": "options?.signal"
  },
  {
    "row": "a0854",
    "operand": "options?.signal"
  },
  {
    "row": "a0855",
    "operand": "withShareSignal(file.text(), options?.signal)"
  },
  {
    "row": "a0856",
    "operand": "file.text()"
  },
  {
    "row": "a0857",
    "operand": "options?.signal"
  },
  {
    "row": "a0858",
    "operand": "file.text()"
  },
  {
    "row": "a0859",
    "operand": "options?.signal"
  },
  {
    "row": "a0860",
    "operand": "checkAbort(options?.signal)"
  },
  {
    "row": "a0861",
    "operand": "options?.signal"
  },
  {
    "row": "a0862",
    "operand": "options?.signal"
  },
  {
    "row": "a0863",
    "operand": "parseSceneShare(text, options)"
  },
  {
    "row": "a0864",
    "operand": "text"
  },
  {
    "row": "a0865",
    "operand": "options"
  },
  {
    "row": "a0866",
    "operand": "{ signal } = {}"
  },
  {
    "row": "a0867",
    "operand": "parseSceneDocument(stringifySceneDocument(project))"
  },
  {
    "row": "a0868",
    "operand": "stringifySceneDocument(project)"
  },
  {
    "row": "a0869",
    "operand": "stringifySceneDocument(project)"
  },
  {
    "row": "a0870",
    "operand": "project"
  },
  {
    "row": "a0871",
    "operand": "[]"
  },
  {
    "row": "a0872",
    "operand": "new Map()"
  },
  {
    "row": "a0873",
    "operand": "0"
  },
  {
    "row": "a0874",
    "operand": "packsOf(copy)"
  },
  {
    "row": "a0875",
    "operand": "copy"
  },
  {
    "row": "a0876",
    "operand": "checkAbort(signal)"
  },
  {
    "row": "a0877",
    "operand": "signal"
  },
  {
    "row": "a0878",
    "operand": "JSON.stringify([pack.source.adapter, pack.source.path])"
  },
  {
    "row": "a0879",
    "operand": "[pack.source.adapter, pack.source.path]"
  },
  {
    "row": "a0880",
    "operand": "known.get(key)"
  },
  {
    "row": "a0881",
    "operand": "key"
  },
  {
    "row": "a0882",
    "operand": "assets.length >= SHARE_LIMITS.assets"
  },
  {
    "row": "a0883",
    "operand": "fail('assets', 'too many bundled assets')"
  },
  {
    "row": "a0884",
    "operand": "'assets'"
  },
  {
    "row": "a0885",
    "operand": "'too many bundled assets'"
  },
  {
    "row": "a0886",
    "operand": "withShareSignal(\n        resolveAsset(pack, { signal }),\n        signal,\n      )"
  },
  {
    "row": "a0887",
    "operand": "resolveAsset(pack, { signal })"
  },
  {
    "row": "a0888",
    "operand": "signal"
  },
  {
    "row": "a0889",
    "operand": "resolveAsset(pack, { signal })"
  },
  {
    "row": "a0890",
    "operand": "pack"
  },
  {
    "row": "a0891",
    "operand": "{ signal }"
  },
  {
    "row": "a0892",
    "operand": "checkAbort(signal)"
  },
  {
    "row": "a0893",
    "operand": "signal"
  },
  {
    "row": "a0894",
    "operand": "fail('assets', 'select a file for every declared data pack')"
  },
  {
    "row": "a0895",
    "operand": "'assets'"
  },
  {
    "row": "a0896",
    "operand": "'select a file for every declared data pack'"
  },
  {
    "row": "a0897",
    "operand": "bytes?.length"
  },
  {
    "row": "a0898",
    "operand": "0"
  },
  {
    "row": "a0899",
    "operand": "bytes?.length"
  },
  {
    "row": "a0900",
    "operand": "checkBytes(bytes, total)"
  },
  {
    "row": "a0901",
    "operand": "bytes"
  },
  {
    "row": "a0902",
    "operand": "total"
  },
  {
    "row": "a0903",
    "operand": "checkMime(asset.mimeType)"
  },
  {
    "row": "a0904",
    "operand": "asset.mimeType"
  },
  {
    "row": "a0905",
    "operand": "digest(bytes)"
  },
  {
    "row": "a0906",
    "operand": "bytes"
  },
  {
    "row": "a0907",
    "operand": "checkAbort(signal)"
  },
  {
    "row": "a0908",
    "operand": "signal"
  },
  {
    "row": "a0909",
    "operand": "pack.byteLength && pack.byteLength !== bytes.length"
  },
  {
    "row": "a0910",
    "operand": "pack.sha256 && pack.sha256 !== sha256"
  },
  {
    "row": "a0911",
    "operand": "pack.byteLength"
  },
  {
    "row": "a0912",
    "operand": "pack.byteLength !== bytes.length"
  },
  {
    "row": "a0913",
    "operand": "pack.byteLength !== bytes.length"
  },
  {
    "row": "a0914",
    "operand": "pack.sha256"
  },
  {
    "row": "a0915",
    "operand": "pack.sha256 !== sha256"
  },
  {
    "row": "a0916",
    "operand": "pack.sha256 !== sha256"
  },
  {
    "row": "a0917",
    "operand": "fail('assets', 'selected file does not match declared integrity')"
  },
  {
    "row": "a0918",
    "operand": "'assets'"
  },
  {
    "row": "a0919",
    "operand": "'selected file does not match declared integrity'"
  },
  {
    "row": "a0920",
    "operand": "pack.source.path.split('/').at(-1).slice(0, 160)"
  },
  {
    "row": "a0921",
    "operand": "0"
  },
  {
    "row": "a0922",
    "operand": "160"
  },
  {
    "row": "a0923",
    "operand": "pack.source.path.split('/').at(-1)"
  },
  {
    "row": "a0924",
    "operand": "-1"
  },
  {
    "row": "a0925",
    "operand": "pack.source.path.split('/')"
  },
  {
    "row": "a0926",
    "operand": "'/'"
  },
  {
    "row": "a0927",
    "operand": "encode(bytes)"
  },
  {
    "row": "a0928",
    "operand": "bytes"
  },
  {
    "row": "a0929",
    "operand": "known.set(key, entry)"
  },
  {
    "row": "a0930",
    "operand": "key"
  },
  {
    "row": "a0931",
    "operand": "entry"
  },
  {
    "row": "a0932",
    "operand": "assets.push(entry)"
  },
  {
    "row": "a0933",
    "operand": "entry"
  },
  {
    "row": "a0934",
    "operand": "pack.byteLength && pack.byteLength !== entry.byteLength"
  },
  {
    "row": "a0935",
    "operand": "pack.sha256 && pack.sha256 !== entry.sha256"
  },
  {
    "row": "a0936",
    "operand": "pack.byteLength"
  },
  {
    "row": "a0937",
    "operand": "pack.byteLength !== entry.byteLength"
  },
  {
    "row": "a0938",
    "operand": "pack.byteLength !== entry.byteLength"
  },
  {
    "row": "a0939",
    "operand": "pack.sha256"
  },
  {
    "row": "a0940",
    "operand": "pack.sha256 !== entry.sha256"
  },
  {
    "row": "a0941",
    "operand": "pack.sha256 !== entry.sha256"
  },
  {
    "row": "a0942",
    "operand": "fail('assets', 'conflicting shared asset integrity')"
  },
  {
    "row": "a0943",
    "operand": "'assets'"
  },
  {
    "row": "a0944",
    "operand": "'conflicting shared asset integrity'"
  },
  {
    "row": "a0945",
    "operand": "JSON.stringify({\n    format: 'gev-scene-bundle',\n    version: 1,\n    project: copy,\n    assets: assets.map(({ byteLength, ...entry }) => entry),\n  })"
  },
  {
    "row": "a0946",
    "operand": "{\n    format: 'gev-scene-bundle',\n    version: 1,\n    project: copy,\n    assets: assets.map(({ byteLength, ...entry }) => entry),\n  }"
  },
  {
    "row": "a0947",
    "operand": "'gev-scene-bundle'"
  },
  {
    "row": "a0948",
    "operand": "1"
  },
  {
    "row": "a0949",
    "operand": "assets.map(({ byteLength, ...entry }) => entry)"
  },
  {
    "row": "a0950",
    "operand": "({ byteLength, ...entry }) => entry"
  },
  {
    "row": "a0951",
    "operand": "new TextEncoder().encode(text).length > SHARE_LIMITS.bytes"
  },
  {
    "row": "a0952",
    "operand": "new TextEncoder().encode(text)"
  },
  {
    "row": "a0953",
    "operand": "text"
  },
  {
    "row": "a0954",
    "operand": "new TextEncoder()"
  },
  {
    "row": "a0955",
    "operand": "fail('$', 'share exceeds 50 MiB')"
  },
  {
    "row": "a0956",
    "operand": "'$'"
  },
  {
    "row": "a0957",
    "operand": "'share exceeds 50 MiB'"
  },
  {
    "row": "a0958",
    "operand": "new Map()"
  },
  {
    "row": "a0959",
    "operand": "next = new Map()"
  },
  {
    "row": "a0960",
    "operand": "new Map()"
  },
  {
    "row": "a0961",
    "operand": "new Map(next)"
  },
  {
    "row": "a0962",
    "operand": "next"
  },
  {
    "row": "a0963",
    "operand": "assets.clear()"
  },
  {
    "row": "a0964",
    "operand": "new Map(assets)"
  },
  {
    "row": "a0965",
    "operand": "assets"
  },
  {
    "row": "a0966",
    "operand": "[...assets.values()].reduce((n, a) => n + a.bytes.length, 0)"
  },
  {
    "row": "a0967",
    "operand": "(n, a) => n + a.bytes.length"
  },
  {
    "row": "a0968",
    "operand": "0"
  },
  {
    "row": "a0969",
    "operand": "assets.values()"
  },
  {
    "row": "a0970",
    "operand": "maxBytes = PACK_LIMITS.bytes"
  },
  {
    "row": "a0971",
    "operand": "checkAbort(signal)"
  },
  {
    "row": "a0972",
    "operand": "signal"
  },
  {
    "row": "a0973",
    "operand": "validateAssetPath(path)"
  },
  {
    "row": "a0974",
    "operand": "path"
  },
  {
    "row": "a0975",
    "operand": "assets.get(path)"
  },
  {
    "row": "a0976",
    "operand": "path"
  },
  {
    "row": "a0977",
    "operand": "!asset"
  },
  {
    "row": "a0978",
    "operand": "asset.bytes.length > maxBytes"
  },
  {
    "row": "a0979",
    "operand": "asset.bytes.length > maxBytes"
  },
  {
    "row": "a0980",
    "operand": "new Error('Bundle asset unavailable \u2014 reimport the bundle')"
  },
  {
    "row": "a0981",
    "operand": "'Bundle asset unavailable \u2014 reimport the bundle'"
  },
  {
    "row": "a0982",
    "operand": "asset.bytes.slice()"
  },
  {
    "row": "a0983",
    "operand": "Promise.resolve(work)"
  },
  {
    "row": "a0984",
    "operand": "work"
  },
  {
    "row": "a0985",
    "operand": "new Promise((resolve, reject) => {\n    const abort = () => {\n      signal.removeEventListener('abort', abort);\n      reject(signal.reason);\n    };\n    if (signal.aborted) {\n      Promise.resolve(work).catch(() => {});\n      abort();\n      return;\n    }\n    signal.addEventListener('abort', abort, { once: true });\n    Promise.resolve(work).then(\n      (value) => {\n        signal.removeEventListener('abort', abort);\n        signal.aborted ? reject(signal.reason) : resolve(value);\n      },\n      (error) => {\n        signal.removeEventListener('abort', abort);\n        reject(error);\n      },\n    );\n  })"
  },
  {
    "row": "a0986",
    "operand": "(resolve, reject) => {\n    const abort = () => {\n      signal.removeEventListener('abort', abort);\n      reject(signal.reason);\n    };\n    if (signal.aborted) {\n      Promise.resolve(work).catch(() => {});\n      abort();\n      return;\n    }\n    signal.addEventListener('abort', abort, { once: true });\n    Promise.resolve(work).then(\n      (value) => {\n        signal.removeEventListener('abort', abort);\n        signal.aborted ? reject(signal.reason) : resolve(value);\n      },\n      (error) => {\n        signal.removeEventListener('abort', abort);\n        reject(error);\n      },\n    );\n  }"
  },
  {
    "row": "a0987",
    "operand": "signal.removeEventListener('abort', abort)"
  },
  {
    "row": "a0988",
    "operand": "'abort'"
  },
  {
    "row": "a0989",
    "operand": "abort"
  },
  {
    "row": "a0990",
    "operand": "reject(signal.reason)"
  },
  {
    "row": "a0991",
    "operand": "signal.reason"
  },
  {
    "row": "a0992",
    "operand": "Promise.resolve(work).catch(() => {})"
  },
  {
    "row": "a0993",
    "operand": "() => {}"
  },
  {
    "row": "a0994",
    "operand": "Promise.resolve(work)"
  },
  {
    "row": "a0995",
    "operand": "work"
  },
  {
    "row": "a0996",
    "operand": "abort()"
  },
  {
    "row": "a0997",
    "operand": "signal.addEventListener('abort', abort, { once: true })"
  },
  {
    "row": "a0998",
    "operand": "'abort'"
  },
  {
    "row": "a0999",
    "operand": "abort"
  },
  {
    "row": "a1000",
    "operand": "{ once: true }"
  },
  {
    "row": "a1001",
    "operand": "true"
  },
  {
    "row": "a1002",
    "operand": "Promise.resolve(work).then(\n      (value) => {\n        signal.removeEventListener('abort', abort);\n        signal.aborted ? reject(signal.reason) : resolve(value);\n      },\n      (error) => {\n        signal.removeEventListener('abort', abort);\n        reject(error);\n      },\n    )"
  },
  {
    "row": "a1003",
    "operand": "(value) => {\n        signal.removeEventListener('abort', abort);\n        signal.aborted ? reject(signal.reason) : resolve(value);\n      }"
  },
  {
    "row": "a1004",
    "operand": "(error) => {\n        signal.removeEventListener('abort', abort);\n        reject(error);\n      }"
  },
  {
    "row": "a1005",
    "operand": "Promise.resolve(work)"
  },
  {
    "row": "a1006",
    "operand": "work"
  },
  {
    "row": "a1007",
    "operand": "signal.removeEventListener('abort', abort)"
  },
  {
    "row": "a1008",
    "operand": "'abort'"
  },
  {
    "row": "a1009",
    "operand": "abort"
  },
  {
    "row": "a1010",
    "operand": "signal.aborted"
  },
  {
    "row": "a1011",
    "operand": "reject(signal.reason)"
  },
  {
    "row": "a1012",
    "operand": "resolve(value)"
  },
  {
    "row": "a1013",
    "operand": "reject(signal.reason)"
  },
  {
    "row": "a1014",
    "operand": "signal.reason"
  },
  {
    "row": "a1015",
    "operand": "resolve(value)"
  },
  {
    "row": "a1016",
    "operand": "value"
  },
  {
    "row": "a1017",
    "operand": "signal.removeEventListener('abort', abort)"
  },
  {
    "row": "a1018",
    "operand": "'abort'"
  },
  {
    "row": "a1019",
    "operand": "abort"
  },
  {
    "row": "a1020",
    "operand": "reject(error)"
  },
  {
    "row": "a1021",
    "operand": "error"
  },
  {
    "row": "a1022",
    "operand": "{ sourceIds = [], layerIds = [] } = {}"
  },
  {
    "row": "a1023",
    "operand": "sourceIds = []"
  },
  {
    "row": "a1024",
    "operand": "layerIds = []"
  },
  {
    "row": "a1025",
    "operand": "new Set(sourceIds)"
  },
  {
    "row": "a1026",
    "operand": "sourceIds"
  },
  {
    "row": "a1027",
    "operand": "new Set(layerIds)"
  },
  {
    "row": "a1028",
    "operand": "layerIds"
  },
  {
    "row": "a1029",
    "operand": "project.scenes.flatMap((scene) =>\n    (scene.dataPacks || []).map((pack) => ({\n      scene: scene.title || scene.id,\n      id: pack.id,\n      path: pack.source.path,\n      attribution: pack.attribution,\n      status:\n        pack.source.adapter === BUNDLE_SOURCE\n          ? assets.has(pack.source.path)\n            ? 'Included in bundle'\n            : 'Missing bundle file \u2014 reimport its bundle'\n          : sources.has(pack.source.adapter)\n            ? 'Source configured; file checked when loaded'\n            : 'Source unavailable',\n    })),\n  )"
  },
  {
    "row": "a1030",
    "operand": "(scene) =>\n    (scene.dataPacks || []).map((pack) => ({\n      scene: scene.title || scene.id,\n      id: pack.id,\n      path: pack.source.path,\n      attribution: pack.attribution,\n      status:\n        pack.source.adapter === BUNDLE_SOURCE\n          ? assets.has(pack.source.path)\n            ? 'Included in bundle'\n            : 'Missing bundle file \u2014 reimport its bundle'\n          : sources.has(pack.source.adapter)\n            ? 'Source configured; file checked when loaded'\n            : 'Source unavailable',\n    }))"
  },
  {
    "row": "a1031",
    "operand": "(scene.dataPacks || []).map((pack) => ({\n      scene: scene.title || scene.id,\n      id: pack.id,\n      path: pack.source.path,\n      attribution: pack.attribution,\n      status:\n        pack.source.adapter === BUNDLE_SOURCE\n          ? assets.has(pack.source.path)\n            ? 'Included in bundle'\n            : 'Missing bundle file \u2014 reimport its bundle'\n          : sources.has(pack.source.adapter)\n            ? 'Source configured; file checked when loaded'\n            : 'Source unavailable',\n    }))"
  },
  {
    "row": "a1032",
    "operand": "(pack) => ({\n      scene: scene.title || scene.id,\n      id: pack.id,\n      path: pack.source.path,\n      attribution: pack.attribution,\n      status:\n        pack.source.adapter === BUNDLE_SOURCE\n          ? assets.has(pack.source.path)\n            ? 'Included in bundle'\n            : 'Missing bundle file \u2014 reimport its bundle'\n          : sources.has(pack.source.adapter)\n            ? 'Source configured; file checked when loaded'\n            : 'Source unavailable',\n    })"
  },
  {
    "row": "a1033",
    "operand": "scene.dataPacks"
  },
  {
    "row": "a1034",
    "operand": "[]"
  },
  {
    "row": "a1035",
    "operand": "scene.title"
  },
  {
    "row": "a1036",
    "operand": "scene.id"
  },
  {
    "row": "a1037",
    "operand": "pack.source.adapter === BUNDLE_SOURCE"
  },
  {
    "row": "a1038",
    "operand": "assets.has(pack.source.path)\n            ? 'Included in bundle'\n            : 'Missing bundle file \u2014 reimport its bundle'"
  },
  {
    "row": "a1039",
    "operand": "sources.has(pack.source.adapter)\n            ? 'Source configured; file checked when loaded'\n            : 'Source unavailable'"
  },
  {
    "row": "a1040",
    "operand": "pack.source.adapter === BUNDLE_SOURCE"
  },
  {
    "row": "a1041",
    "operand": "assets.has(pack.source.path)"
  },
  {
    "row": "a1042",
    "operand": "'Included in bundle'"
  },
  {
    "row": "a1043",
    "operand": "'Missing bundle file \u2014 reimport its bundle'"
  },
  {
    "row": "a1044",
    "operand": "assets.has(pack.source.path)"
  },
  {
    "row": "a1045",
    "operand": "pack.source.path"
  },
  {
    "row": "a1046",
    "operand": "sources.has(pack.source.adapter)"
  },
  {
    "row": "a1047",
    "operand": "'Source configured; file checked when loaded'"
  },
  {
    "row": "a1048",
    "operand": "'Source unavailable'"
  },
  {
    "row": "a1049",
    "operand": "sources.has(pack.source.adapter)"
  },
  {
    "row": "a1050",
    "operand": "pack.source.adapter"
  },
  {
    "row": "a1051",
    "operand": "project.scenes.reduce((n, s) => n + s.shots.length, 0)"
  },
  {
    "row": "a1052",
    "operand": "(n, s) => n + s.shots.length"
  },
  {
    "row": "a1053",
    "operand": "0"
  },
  {
    "row": "a1054",
    "operand": "[\n      ...new Set(\n        project.scenes.flatMap((s) =>\n          s.shots.flatMap((shot) => Object.keys(shot.layers || {})),\n        ),\n      ),\n    ].filter((id) => !layers.has(id))"
  },
  {
    "row": "a1055",
    "operand": "(id) => !layers.has(id)"
  },
  {
    "row": "a1056",
    "operand": "new Set(\n        project.scenes.flatMap((s) =>\n          s.shots.flatMap((shot) => Object.keys(shot.layers || {})),\n        ),\n      )"
  },
  {
    "row": "a1057",
    "operand": "project.scenes.flatMap((s) =>\n          s.shots.flatMap((shot) => Object.keys(shot.layers || {})),\n        )"
  },
  {
    "row": "a1058",
    "operand": "project.scenes.flatMap((s) =>\n          s.shots.flatMap((shot) => Object.keys(shot.layers || {})),\n        )"
  },
  {
    "row": "a1059",
    "operand": "(s) =>\n          s.shots.flatMap((shot) => Object.keys(shot.layers || {}))"
  },
  {
    "row": "a1060",
    "operand": "s.shots.flatMap((shot) => Object.keys(shot.layers || {}))"
  },
  {
    "row": "a1061",
    "operand": "(shot) => Object.keys(shot.layers || {})"
  },
  {
    "row": "a1062",
    "operand": "Object.keys(shot.layers || {})"
  },
  {
    "row": "a1063",
    "operand": "shot.layers || {}"
  },
  {
    "row": "a1064",
    "operand": "shot.layers"
  },
  {
    "row": "a1065",
    "operand": "{}"
  },
  {
    "row": "a1066",
    "operand": "layers.has(id)"
  },
  {
    "row": "a1067",
    "operand": "id"
  },
  {
    "row": "a1068",
    "operand": "project.scenes.some(\n      (s) =>\n        s.appliedShotPacks?.length || s.shots.some((shot) => shot.sourcePackId),\n    )"
  },
  {
    "row": "a1069",
    "operand": "(s) =>\n        s.appliedShotPacks?.length || s.shots.some((shot) => shot.sourcePackId)"
  },
  {
    "row": "a1070",
    "operand": "s.appliedShotPacks?.length"
  },
  {
    "row": "a1071",
    "operand": "s.shots.some((shot) => shot.sourcePackId)"
  },
  {
    "row": "a1072",
    "operand": "s.appliedShotPacks?.length"
  },
  {
    "row": "a1073",
    "operand": "s.shots.some((shot) => shot.sourcePackId)"
  },
  {
    "row": "a1074",
    "operand": "(shot) => shot.sourcePackId"
  },
  {
    "row": "a1075",
    "operand": "[...assets.values()].reduce((n, a) => n + a.bytes.length, 0)"
  },
  {
    "row": "a1076",
    "operand": "(n, a) => n + a.bytes.length"
  },
  {
    "row": "a1077",
    "operand": "0"
  },
  {
    "row": "a1078",
    "operand": "assets.values()"
  },
  {
    "row": "a1079",
    "operand": "disposed || signal?.aborted"
  }
]
```
