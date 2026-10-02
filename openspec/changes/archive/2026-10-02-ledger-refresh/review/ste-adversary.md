Verdict: PASS

- [ ] FINDING minor proposal.md:27 "Six more files have smaller counts" -> "Six more files have smaller counts of lines not covered". Line 28 says the branch counts of `briefing.js` and `news.js` rise, so "smaller counts" can mean the wrong count. Line 28 also says "does not fall" for the covered count.
- [ ] FINDING minor proposal.md:28 "the count of branches not covered rises, and the total of branches rises with it" -> "the number of branches not covered rises, and the number of all branches rises with it". The text uses "count" and "total" for the same kind of value. The text uses "count" for the value in the ledger (lines 5 and 25), so keep "count" and drop "total". Also write "the count of all branches" on line 29 for the same reason.
- [ ] FINDING minor proposal.md:28 "The history line says" -> "Each history line of these files says". The change has 29 history lines, so "The history line" has no clear referent.
- [ ] FINDING minor proposal.md:5 "The difference is more than the tolerance of the gates." -> "Each difference is more than the tolerance of the gates." There are two differences (3 to 0, and 359 to 314).
- [ ] FINDING minor proposal.md:9 and design.md:7 "the counts of its run" / "a current run" -> "the counts that it measures" / "the counts of the gates on this tree". "Run" is used as a noun here, and it is a verb in tasks 1.1, 2.1 and 2.2.
- [ ] FINDING minor design.md:16 "name the exception" -> "name the cases where the counts can differ". The section states no exception, so "the exception" has no referent.
- [ ] FINDING minor proposal.md:25 "The entry of `alprCameras.js` leaves the ledger, because its gap closed." -> delete the sentence. Line 26 says the same for the four entries, so the sentence repeats it. It also puts the 342 sentence in a paragraph with a different topic.

Checks that pass:
- The file lists agree. Four closed entries, six smaller, plus `regionalModel.js`, `worldOverlayDraw.js` and `resolver.js`. `briefing.js` and `news.js` are counted among the six. The total is 4 + 6 + 3 = 13.
- The numbers agree across the documents (13 files, 29 lines, 342, 314, 359, 305 to 306).
- I found no sentence over the limit, no inline code over 4 words and no paragraph over 6 sentences.
- Every task starts with an imperative verb and gives one instruction.
