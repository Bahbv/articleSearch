# articleSearch
We can use this small plugin to filter children in a container in realtime with a `.is-hidden` class.

## What it does
When there is a keyup event on the searchInput it filters all the children in the container. It looks at all the text in the children and all the all tags. If there isn't a match with the value from the input the child element will get the `.is-hidden` class.

## Options
| Option        | Default       |                                    |
| ------------- |:-------------:| ----------------------------------:|
| container     | null          | The container containing children  |
| searchInput   | null          | The inputfield for the keyup event |

## How to use
Just add the script to your HTML, have a container with children/articles/items in it and an input field. Initialize the plugin with the following code:
```js
// Init articleSearch
articleSearch.init({
    container: document.getElementById('js-articles'),
    searchInput: document.getElementById('js-articles-search'),
});
```