//Riffed from Sharee

import { Page, TestInfo, expect } from "@playwright/test";

function isClosedPageError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);

  return (
    message.includes("Target page, context or browser has been closed") ||
    message.includes("Execution context was destroyed") ||
    message.includes("Target closed") ||
    message.includes("Page closed")
  );
}

async function runWhilePageOpen(
  page: Page,
  action: () => Promise<void>,
): Promise<boolean> {
  if (page.isClosed()) {
    return false;
  }

  try {
    await action();
    return !page.isClosed();
  } catch (error) {
    if (page.isClosed() || isClosedPageError(error)) {
      return false;
    }

    throw error;
  }
}

export async function emulateLazyLoadScroll(page: Page): Promise<void> {
  const DOWN_SCROLL_DISTANCE = 200;
  const UP_SCROLL_DISTANCE = 300;
  const MAX_SCROLL_STEPS = 200; // failsafe
  const WAIT_BETWEEN_SCROLLS = 100;

  //  1. SCROLL DOWN TO TRIGGER LAZY LOAD

  const completedScrollDown = await runWhilePageOpen(page, () =>
    page.evaluate(
      async ({ distance, maxSteps, waitMs }) => {
        await new Promise<void>((resolve) => {
          let steps = 0;

          const scrollDown = () => {
            steps++;
            window.scrollBy(0, distance);

            if (
              steps >= maxSteps ||
              window.innerHeight + window.scrollY >= document.body.scrollHeight
            ) {
              resolve();
              return;
            }

            setTimeout(scrollDown, waitMs);
          };

          scrollDown();
        });
      },
      {
        distance: DOWN_SCROLL_DISTANCE,
        maxSteps: MAX_SCROLL_STEPS,
        waitMs: WAIT_BETWEEN_SCROLLS,
      },
    ),
  );

  if (!completedScrollDown) {
    return;
  }

  //  2. STABILIZE LAYOUT AFTER SCROLLING

  if (
    !(await runWhilePageOpen(page, () =>
      page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      ),
    ))
  ) {
    return;
  }

  //  3. SCROLL BACK TO TOP SAFELY (smooth-ish)

  if (
    !(await runWhilePageOpen(page, () =>
      page.evaluate(
        async ({ distance, waitMs, maxSteps }) => {
          await new Promise<void>((resolve) => {
            let steps = 0;

            const scrollUp = () => {
              steps++;

              if (window.scrollY <= 0 || steps >= maxSteps) {
                window.scrollTo(0, 0);
                resolve();
                return;
              }

              window.scrollBy(0, -distance);
              setTimeout(scrollUp, waitMs);
            };

            scrollUp();
          });
        },
        {
          distance: UP_SCROLL_DISTANCE,
          waitMs: WAIT_BETWEEN_SCROLLS,
          maxSteps: MAX_SCROLL_STEPS,
        },
      ),
    ))
  ) {
    return;
  }

  //  4. FINAL STABILIZATION BEFORE SCREENSHOT

  if (
    !(await runWhilePageOpen(page, () =>
      page.evaluate(
        () =>
          new Promise((resolve) =>
            requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
          ),
      ),
    ))
  ) {
    return;
  }

  await new Promise((resolve) => setTimeout(resolve, 500));
}