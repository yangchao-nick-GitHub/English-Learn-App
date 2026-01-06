I will modify `src/pages/ProgressEditor/index.tsx` to remove the display sections as requested, keeping only the settings functionality.

**Planned Changes:**

1.  **Remove "Current Learning Status" Card**: Delete the section showing the current dictionary, position, and streak.
2.  **Remove "Dictionary Progress List" Card**: Delete the section listing progress for all dictionaries.
3.  **Remove "Instructions" Card**: Delete the usage instructions and tips section.
4.  **Retain "Current Learning Settings"**: Keep the form for selecting dictionary and setting chapter/word index.

The logic for `getAllDictsProgress` will be preserved as it is required for the dictionary selection dropdown in the settings form.
