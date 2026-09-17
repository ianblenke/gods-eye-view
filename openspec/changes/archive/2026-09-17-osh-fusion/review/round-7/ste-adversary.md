Verified all 29 round-6 corrections against the files, plus links.json and the new text.

**Report (round 7, STE adversary):**

```
Verdict: PASS
Findings: 0 major, 9 minor (all in text new since round 6)

S1 to S29: corrected. Each of the 29 is right in every place it names, including
the three sentences of S1 (get.js:116, design.md:60, review.md:120), the two test
names, and the matching names in openspec/trace/links.json. Your S27 replacement,
the five short sentences at review.md:85, reads correctly; I have nothing on it.
The second sentence you found and corrected yourself (review.md:61, "cause a
deletion") is right too.

- [ ] S30 minor review.md:117 "`URLSearchParams.toString()` writes `&`, `=`, `;`, `#`, `/` and `?` out of each value" Verbs. "write out of" is a phrasal verb with no approved meaning; a reader can read it as "writes out". The same sentence mixes "reaches" with "matched". Write: "A key reaches the server only after `includes()` matches it against one of the six literal strings, and `URLSearchParams.toString()` escapes `&`, `=`, `;`, `#`, `/` and `?` in each value."
- [ ] S31 minor review.md:113 and :119 "either half alone answered both" One word, one meaning. "answer" means "respond" elsewhere in this change (proposal.md:17, "the candidate that answered"). Write: "either half alone made both cases pass". In the same two places: review.md:119 "A mutation test on each half fails one test" reads as if the mutation test itself fails; write "A mutation test on each half now makes one test fail". review.md:113 "The test now also gives a link" does not say which test; write "The test of that clause now also gives a link".
- [ ] S32 minor proposal.md:72 "The walk re-encodes the value" and review.md:121 "named the stop, not the rewrite" One word, one meaning. The design (D10a) and get.js:120 call this one thing "the rebuild". Write, in proposal.md:72: "The rebuild writes the value of each accepted key again." In review.md:121: "The known limit named only the refused link, not the rebuild of the query."
- [ ] S33 minor proposal.md:72 "A server that separates a query on `;` ... gets a request it did not send" Two faults. "separates" is a second word for "splits" (review.md:120, design D10a). And a server does not send a request; it gives the next link. Write: "A server that splits a query on `;`, or that signs the bytes of its query string, gets a request that does not match the link it gave."
- [ ] S34 minor review.md:122 "The round-2 count was 22." The sentence states the wrong number as fact, and the next sentence contradicts it. F5 one line below uses the right form ("The header said"). Write: "The text said the round-2 count was 22."
- [ ] S35 minor review.md:129 "a fault that round 5 read and passed" and "The rest are the purpose of the capability" One word, one meaning, and Articles and nouns. "pass" is the verdict everywhere else; and a finding is not a purpose. Write: "a fault that round 5 read and did not report" and "The rest are in the purpose of the capability, in the comments of `get.js`, and in this file."
- [ ] S36 minor review.md:133 and :135 "In each the code was right", "The design of this change held from round 1", "the owner's question is what opened the change again to find it" Articles and nouns, and Verbs. "in each" has no noun, "hold" with this meaning is an idiom, and the last clause is not a simple sentence. Write: "In each round the code was right. The design of this change did not change after round 1, and every later finding was about the proof or the words." And: "That one was a real way past the check, and the owner's question opened the change again and found it."
- [ ] S37 minor review.md:105 and :106 "username, with the password half kept" The column is "Clause absent", so the row must name the absent half. Write: "the username half, with the password half kept" and "the password half, with the username half kept".
- [ ] S38 minor src/data/oshGet.test.mjs:278 "the guard alone would accept it" One word, one meaning. Your S14 and S15 corrections removed "guard" from get.js, so this comment is the last place in the change with a second name for the check. Write: "the check alone would accept it".
- [ ] S39 minor review/round-6/ste-adversary.md, the author's note at the end of the file "Note, asked for by the author:" Voice. Write: "The author asked for this note. The agent's own header says ..." and keep the rest of the note as it is.
```

Two notes for you. The new two-line comment in the username-and-password test is correct as written; I have nothing on it, and nothing on the new limit `osh-page-link-rewrite` beyond S32 and S33. The round-5 files carry no note of yours, only the agents' own closing text, so there is nothing of yours to report there.

Everything is minor, so nothing from me blocks the record. My round-6 FAIL is answered: S1 is corrected in all three places, and the behaviour and the prose now agree.

One thing your second note makes me want to name plainly: the word in S38 is the same word the mutation table is about. Your message calls it "no clause of the guard is unproven". After S38 the change has one name for that function, "the check", so if any prose of yours still says "guard", it belongs in the same correction.
