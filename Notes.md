🎉 ScrollView vs FlatList

# Use FlatList when:

- Performance is critical: FlatList only renders items currently visible on screen, saving memory and improving performance.
- Long lists of data: When rendering potentially large sets of data (feeds, search results, message lists).
- Unknown content length: When you don't know in advance how many items you'll need to display.
- Same kind of content: When displaying many items with the same structure.

# Use ScrollView when:

- All content fits in memory: When you're displaying a small, fixed amount of content that won't cause performance issues.
- Static content: For screens with predetermined, limited content like forms, profile pages, or detail views.
- Mixed content types: When you need to display different UI components in a specific layout that doesn't follow a list pattern.
- Horizontal carousel-like elements: Small horizontal scrolling components like image carousels with limited items.
