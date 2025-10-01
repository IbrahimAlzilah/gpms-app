# Smart HR Icon Font

A custom icon font package for the Smart HR application.

## Structure

```
sma-cons/
├── fonts/          # Font files
├── css/           # CSS styles
├── selection.json # Icon selection data
└── README.md      # This file
```

## Font Files

- `sma-icons.eot` - IE8 and below
- `sma-icons.woff` - Modern browsers
- `sma-icons.woff2` - Modern browsers (better compression)
- `sma-icons.ttf` - Fallback
- `sma-icons.svg` - Legacy iOS

## Usage

1. Include the CSS file:
```html
<link rel="stylesheet" href="sma-cons/css/style.css">
```

2. Use icons in your HTML:
```html
<i class="sma-icon sm-users-line"></i>
```

## Maintenance

To modify the icon set:

1. Use IcoMoon (or your preferred icon font generator)
2. Import the `selection.json` file
3. Make your changes
4. Generate new font files
5. Replace the files in the `fonts/` directory

## Browser Support

- Chrome 4+
- Firefox 3.5+
- Safari 3.1+
- Opera 10+
- IE 8+

## License

[Your License Here] 
