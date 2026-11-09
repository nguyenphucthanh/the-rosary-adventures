# Dev cheat save

`save-all-complete.json`: all 20 mysteries + 6 interludes completed, beads lit, resume at the last stage.

Load: run `pbcopy < dev/save-all-complete.json`, then in the game's DevTools console:

```js
localStorage.setItem("rosary_adventure_save_slot_1", JSON.stringify(PASTE_HERE)); location.reload();
```

To jump to a stage: edit `currentMysteryKey` (+ `currentMysteryIndex`, 0-19, for mysteries) before pasting, then press Continue.
