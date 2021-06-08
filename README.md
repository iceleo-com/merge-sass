# merge-sass
This tool can merge non-compiled SASS

# Installation
`npm install merge-sass --save-dev`

# Online test
[https://iceleo-com.github.io/merge-sass/index.html](https://iceleo-com.github.io/merge-sass/index.html)

# Example
```
const fs = require('fs');
const mergeSass = require('merge-sass');

const result = mergeSass(
    fs.readFileSync('/path_to_target_sass_file.scss'),
    fs.readFileSync('/path_to_update_sass_file.scss'),
);
```
> **Target Rules**
> ```
> body {
>     background: red;
>     text-decoration: none;
> }
> 
> body {
>     background: blue;
>     margin: 10px;
> }
> ```
> **Update Rules**
> ```
> body {
>     background: green;
>     margin: 0 10px;
>     text-align: center;
> }
> ```
> **Expected Rules**
> ```
> body {
>     background: green;
>     text-decoration: none;
>     margin: 0 10px;
>     text-align: center;
> }
> ```

# Contribution
This tool has a lot of limits but I have no time to make it better, so every contribution is welcome.
