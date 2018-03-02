import Component from '@ember/component';
import { inject } from '@ember/service';
import layout from '../templates/components/component-pool';

export default Component.extend({
  layout,
  tagName: '',

  componentPool: inject(),

  key: null,
  max: 0,
  order: 0,

  didInsertElement() {
    this._super(...arguments);

    let reg = this.get('componentPool').register(
      this.get('key'),
      this.get('max'),
      this.get('order')
    );

    this.setProperties({ reg });
  },

  willDestroyElement() {
    this._super(...arguments);

    let reg = this.get('reg');

    this.get('componentPool').unregister(reg);
  }
});
