/* eslint ember/closure-actions: 0 */

import { A } from '@ember/array';
import Component from '@ember/component';
import { run } from '@ember/runloop';
import { isEmpty } from '@ember/utils';
import { observer, computed } from '@ember/object';
import Ember from 'ember';
import noUiSlider from 'noUiSlider';

const {
  Logger: { warn }
} = Ember;

export default Component.extend({
  attributeBindings: ['disabledOrUndefined:disabled'],
  slider:       null,
  start:        undefined,
  step:         undefined,
  margin:       undefined,
  limit:        undefined,
  pips:         undefined,
  animate:      true,
  snap:         false,
  connect:      false,
  disabled:     false,
  orientation:  'horizontal',
  direction:    'ltr',
  behaviour:    'tap',
  tooltips:     false,
  multitouch:   false,

  min: 0,
  max: 100,

  range: computed('min', 'max', function() {
    return {
      min: this.get('min'),
      max: this.get('max')
    };
  }),

  formatTo(value) {
    return value;
  },

  formatFrom(value) {
    return +value;
  },

  format: computed('formatTo', 'formatFrom', function() {
    return {
      to: this.get('formatTo'),
      from: this.get('formatFrom')
    };
  }),

  didInsertElement() {
    this.setup();
  },

  setup() {
    let element = this.get('element');
    let { noUiSlider: slider } = element;
    let properties = this.getProperties(
      'start', 'step', 'margin',
      'limit', 'range', 'connect',
      'orientation', 'direction',
      'behaviour', 'animate', 'snap',
      'pips', 'format', 'tooltips',
      'multitouch'
    );
    let sliderEvents = A(['change', 'set', 'slide', 'update', 'start', 'end']);

    // We first check if the element has a slider already created
    if (slider && slider.destroy) {
      slider.destroy();
    }

    try {
      slider = noUiSlider.create(element, properties, true);
    } catch (err) {
      warn(`[ember-cli-nouislider]: ${err}`);
    }

    this.slider = slider;

    sliderEvents.forEach(event => {
      if (!isEmpty(this.get(`on-${event}`))) {
        slider.on(event, () => {
          run(this, function() {
            let val = this.get("slider").get();
            this.sendAction(`on-${event}`, val);
          });
        });
      }
    });

    /** DEPRECATED AND WILL BE REMOVED BEFORE 1.0 **/
    slider.on('change', () => {
      run(this, function () {
          let val = this.get("slider").get();
          this.sendDeprecatedAction("change", val);
      });
    });

    if (!isEmpty(this.get('slide'))) {
      slider.on('slide', () => {
        run(this, function () {
          let val = this.get("slider").get();
          this.sendDeprecatedAction('slide', val);
        });
      });
    }
  },

  didUpdateAttrs() {
    this.update();
  },

  update() {
    let slider = this.get('slider');
    let properties = this.getProperties(
      'margin', 'limit', 'step',
      'range', 'animate', 'snap',
      'start'
    );

    if (slider) {
      slider.updateOptions(properties);
    }
  },

  willDestroyElement() {
    this.teardown();
  },

  teardown() {
    var slider = this.get('slider');

    slider.off('change');
    slider.off('slide');
    slider.off('set');
    slider.off('update');
    slider.off('start');
    slider.off('end');

    slider.destroy();
  },

  setValue: observer('start', function() {
    let { slider } = this;

    if (slider) {
      let value = this.get('start');
      slider.set(value);
    }
  }),

  // disabled can't be just `false` - this leads to an attribute of disabled="false"
  disabledOrUndefined: computed('disabled', function() {
    if (this.get('disabled')) {
      return true;
    }
  }),
  /**
   * Perform a naive check to see if the deprecated action name exists in our
   * attrs and then log a deprecation warning and trigger the old action.
   */
  sendDeprecatedAction(action, value) {
    var actionName = this.get(`attrs.${action}`);
    if(!isEmpty(actionName)) {
      Ember.Logger.warn(`DEPRECATION (ember-cli-nouislider): "${action}" action is deprecated in favor of "on-${action}". Support for "${action}" will be dropped in 1.0`);
      this.sendAction(action, value);
    }
  }
});
