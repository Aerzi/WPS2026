# UX Patterns for Rehearsal Annotations

**Target Audience:** Product Manager / UX Designer
**Objective:** Define best-practice interaction patterns for giving feedback on presentation rehearsals.

## 1. The "Dual-Stream" Feedback Interface
*   **Concept:** Separating "Content Feedback" (Slide design, typos) from "Delivery Feedback" (Voice, body language).
*   **UX Pattern:**
    *   **Left Panel (Slides):** Standard spatial comments. "Fix this typo."
    *   **Bottom Panel (Timeline):** Temporal comments. "You spoke too fast here."
    *   **Linkage:** Clicking a timeline comment *auto-scrolls* the slide deck to the slide active at that moment.

## 2. Real-Time "Reaction" Streams
*   **Problem:** Writing a comment breaks the reviewer's focus during a live run-through.
*   **Solution:** Emoji "Explosions" or Sentiment Tracking.
*   **UX Pattern:**
    *   Reviewer presses keys (1=Slow Down, 2=Great, 3=Confused) during playback.
    *   **Result:** A density graph overlay on the timeline showing audience sentiment peaks and valleys without blocking the video.

## 3. Transcript-Anchored Annotations
*   **Concept:** Speech is the primary medium of a rehearsal, not pixels.
*   **UX Pattern:**
    *   Display the ASR (Auto Speech Recognition) transcript side-by-side with the video.
    *   **Action:** Reviewer highlights a sentence in the text -> System timestamps the comment to the video start/end of that sentence.
    *   **Benefit:** Precise editing of the *script* ("Don't say 'um' here, say 'therefore'").

## 4. "Suggestion Mode" for Speech
*   **Concept:** Similar to Google Docs "Suggesting" mode, but for spoken words.
*   **UX Pattern:**
    *   Reviewer highlights transcript text: "We achieved 100% growth."
    *   Reviewer types suggestion: "We *surpassed* 100% growth."
    *   **Display:** The transcript shows the diff. The speaker can "Accept" (updates their script notes) or "Reject".

## 5. Automated "Flag" Annotations
*   **Concept:** The system acts as the first reviewer.
*   **UX Pattern:**
    *   System inserts "Warning Flags" on the timeline for:
        *   Long pauses (>3s).
        *   Filler word clusters.
        *   Monotone pitch (Pitch variance < threshold).
    *   **Interaction:** User can click the flag to "Ignore" (false positive) or "Practice" (opens a drill for that section).

## References
*   [1] **Nielsen Norman Group** - Video Usability Guidelines: https://www.nngroup.com/articles/video-usability/
*   [2] **Descript** - Editing Video by Editing Text: https://help.descript.com/hc/en-us/articles/10543207758349-Editing-video-in-Descript
*   [3] **Frame.io** - Precision Commenting: https://help.frame.io/zh-CN/articles/9105251-%E4%B8%BA%E5%AA%92%E4%BD%93%E6%B7%BB%E5%8A%A0%E8%AF%84%E8%AE%BA

