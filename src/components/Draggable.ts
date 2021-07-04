
import { defineComponent, PropType, h } from 'vue';
import { constants } from 'smooth-dnd';
import { TagObjectInterface, addClassToTag } from './dndUtils';

export default defineComponent({
  name: 'Draggable',
  props: {
    tag: {
      type: Object as PropType<TagObjectInterface>,
      default: () => ({ value: 'div', props: {} }),
    },
  },
  setup(props, {slots}) {
    const tag = Object.assign({}, props.tag);
    addClassToTag(tag, constants.wrapperClass);
    return () => h(tag.value, tag.props, slots?.default?.())
  },
});
