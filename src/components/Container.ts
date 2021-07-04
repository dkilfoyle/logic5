// adapted from vue3-smooth-dnd
import {
  defineComponent,
  onMounted,
  ref,
  PropType,
  h
} from 'vue';
import { smoothDnD, dropHandlers, ContainerOptions } from 'smooth-dnd';
import { TagObjectInterface } from './dndUtils';

smoothDnD.dropHandler = dropHandlers.reactDropHandler().handler;
smoothDnD.wrapChild = false;

export default defineComponent({
  name: 'Container',
  setup(props, { emit, slots }) {
    const container = ref<HTMLElement>();

    onMounted(() => {
      const options = Object.assign({}, props) as ContainerOptions;
      options.onDragStart = (p) => {console.log('dragstart'); emit('drag-start', p)};
      options.onDragEnd = (p) => emit('drag-end', p);
      options.onDrop = (p) => emit('drop', p);
      options.onDragEnter = () => emit('drag-enter');
      options.onDragLeave = () => emit('drag-leave');
      options.onDropReady = (p) => emit('drag-start',p);
      if (container.value) {
        smoothDnD(container.value, options);
      }
    });

    const tag = Object.assign({}, props.tag);
    return () => h(tag.value, Object.assign({}, {ref: container}, tag.props), slots?.default?.())
  },

  emits: [
    'drop',
    'drag-start',
    'drag-end',
    'drag-enter',
    'drag-leave',
    'drop-ready',
  ],

  props: {
    removeOnDropOut: { type: Boolean, default: false },
    autoScrollEnabled: { type: Boolean, default: true },
    behaviour: String,
    groupName: String,
    orientation: String,
    dragHandleSelector: String,
    nonDragAreaSelector: String,
    lockAxis: String,
    dragClass: String,
    dropClass: String,
    dragBeginDelay: Number,
    animationDuration: Number,
    getChildPayload: Function,
    shouldAnimateDrop: Function,
    shouldAcceptDrop: Function,
    getGhostParent: Function,
    dropPlaceholder: [Object, Boolean],
    tag: {
      type: Object as PropType<TagObjectInterface>,
      default: () => ({ value: 'div', props: {} }),
    },
  },
});
