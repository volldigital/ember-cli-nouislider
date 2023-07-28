# @voll/ember-cli-nouislider (fork of ember-cli-nouislider)

This ember-cli addon provides you with a range-slider component, based on
[noUiSlider](http://refreshless.com/nouislider). It includes everything you need,
and adds no extra dependencies other than noUiSlider itself (which has no external dependencies).

To get started simply install the addon:

```
$ ember install @voll/ember-cli-nouislider
```

This will install `nouislider` via Bower, and will include it into your application's
mergetree, so you don't need to worry about anything there.

## Compatibility

* Ember.js v3.12 or above
* Ember CLI v2.13 or above
* Node.js v10 or above

## Component

You have the opportunity to customize if needed.

To do this, generate your own component and re-export
the one provided:

```
$ ember g component range-slider
```

```js
// app/components/range-slider.js
import RangeSlider from '@voll/ember-cli-nouislider/components/range-slider';

export default RangeSlider;
```

Include the slider into your views like this:

```handlebars
{{range-slider start=someValue on-change=(action "changedAction")}}
```

And setup an action handler in your route:

```js
// app/routes/my-route.js
import Controller from '@ember/controller';
import { debug } from '@ember/debug';

export default Controller.extend({
  // ...
  actions: {
    // ...
    changedAction: function(value) {
      debug( `New slider value: ${value}`);
    }
  }
});
```

## Configuration

The component has a lot of configurable options, most of them mapping directly
to the [original options](http://refreshless.com/nouislider/slider-options/).
To see how the slider is initialized internally, please have a look at
`app/components/range-slider.js` in this project.


## License

This project is licensed under the [MIT License](LICENSE.md).
