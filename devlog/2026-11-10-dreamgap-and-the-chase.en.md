After playtesting, the biggest change was to DreamGap.

## DreamGap: from a toggle to an energy bar

The old DreamGap was press-to-start, press-again-to-stop, with a fixed 3-second duration and a 2-second cooldown.

The new version is **hold to maintain, release to end**, with an energy bar:
- holding drains energy; releasing starts the recharge;
- it must be full before it can be used again;
- releasing early keeps the leftover energy, so shorter use recharges faster.

Players now decide how long to use it, and the rhythm shifted from "waiting for a cooldown" to "spending it carefully".

## The corridor chase

To give DreamGap a real job, I built the first chase level: a long corridor with something behind you. Every trap's timing was tuned in a greybox room first, then moved into the real scene:
- The first trap is a gate that opens and closes on a cycle. The moment DreamGap starts, the gate snaps to the beginning of its safe window, so every activation gives a guaranteed way through.
- The second trap became a river crossing over undulating ground.
- The chase now follows the lantern riddle, and opens with a short DreamGap tutorial.

## Tests

The chase level has 47 automated assertions. Together with the DreamGap and integration tests, they all run headless and report their own results.
