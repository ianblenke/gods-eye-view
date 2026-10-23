Verdict: PASS

Commit read: f7593d7a, scope diff e7960aad, a narrow confirmation round. The reviewer ran no code and checked each regular expression by hand. No critical and no major finding, and no new finding. Both majors of round 2 are closed.

- Major A (U+0000, U+001F and U+007F in a thumbnail link): closed. The three bad links are in the test of the thumbnail flag, and the three faults "link without DEL refused", "link control up to 1e" and "link control from 1" each make that test fail.
- Major B (more than one space between two numbers): closed. The footprint with three spaces stays under the rule, and the fault "one space between numbers" removes it, so the test fails. The two footprints with a space or a line break at the end are removed, and the fault "trailing white space accepted" lets them pass, so the test fails.
- The corrections add no new fault. Only the test file changed in the folders server and src.
- Not checked: that the numbers of run 3 came from a real run, and the exact code of each fault.
