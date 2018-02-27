import Service from '@ember/service';
import { setProperties } from '@ember/object';
import { assert } from '@ember/debug';

export default Service.extend({
  init() {
    this._super(...arguments);

    this._groups = {};
  },

  _sync(group) {
    let orders = Object.keys(group.components).sort();
    for (let i = 0; i < orders.length; i++) {
      let component = group.components[orders[i]];
      let shouldShow = i < group.max;
      setProperties(component, { shouldShow });
    }
  },

  register(key, max, order) {
    assert(`must specify a unique key: ${key}`, key);

    let group = this._groups[key];
    if (group) {
      assert(`key/max mismatch, key: ${key}, existing max: ${group.max}, new max: ${max}`, group.max === max);
    } else {
      this._groups[key] = group = {
        max,
        components: {}
      };
    }

    let reg = group.components[order];

    assert(`cannot register component twice, key: ${key}, order: ${order}`, !reg);

    group.components[order] = reg = {
      key,
      order,
      shouldShow: false
    };

    this._sync(group);

    return reg;
  },

  unregister(reg) {
    let group = this._groups[reg.key];

    delete group.components[reg.order];

    this._sync(group);
  }
});
