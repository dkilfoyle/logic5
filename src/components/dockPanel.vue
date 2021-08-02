<template>
  <teleport :to="teleportTarget" v-if="isMounted">
    <div
      v-show="isSelectedTab(name)"
      class="tab-panel tab-panel-active"
      :id="name"
      :style="targetSize"
    >
      <slot />
    </div>
  </teleport>
</template>

<script>
import {
  defineComponent,
  watch,
  reactive,
  inject,
  ref,
  toRefs,
  onBeforeMount,
  onMounted,
  onUpdated,
  computed,
} from 'vue';
import useDockTabs from '../composables/useDockTabs';
import { gsap } from 'gsap';

export default defineComponent({
  name: 'Tab',
  props: {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },

  setup(props) {
    const state = reactive({
      height: 100,
      width: 100,
    });

    const { addTab, getTabBarIdForTab, isSelectedTab, setSelectedTab } =
      useDockTabs();

    const tabBarId = computed(() => {
      return getTabBarIdForTab(props.name);
    });

    const teleportTarget = computed(() => {
      return '#' + tabBarId.value;
    });

    const targetSize = computed(() => {
      return isMounted.value
        ? {
            width: `${document.getElementById(tabBarId.value).clientWidth}px`,
            height: `${document.getElementById(tabBarId.value).clientHeight}px`,
          }
        : {
            width: '100%',
            height: '100%',
          };
    });

    watch(teleportTarget, (newTarget, oldTarget) => {
      if (!isMounted.value) return;

      const tl = gsap.timeline();
      const id = '#' + props.name;
      tl.set(id, { borderWidth: 1 });
      tl.fromTo(
        id,
        { height: '0px', width: '0px' },
        {
          height: targetSize.value.height,
          width: targetSize.value.width,
          duration: 0.5,
        }
      );
      tl.set(id, { borderWidth: 0 });
    });

    const isMounted = ref(false);
    onMounted(() => {
      console.log('mounting ', props.name);
      isMounted.value = true;
    });

    onUpdated(() => {
      console.log('updated ', props.name);
    });

    const tabsProvider = inject('tabsProvider');
    onBeforeMount(() => {
      addTab(tabsProvider.name, {
        name: props.name,
        icon: props.icon,
        label: props.label || props.name,
        isDisabled: props.isDisabled,
      });
      if (props.isSelected) setSelectedTab(tabsProvider.name, props.name);
    });

    return {
      ...toRefs(state),
      teleportTarget,
      targetSize,
      tabBarId,
      isMounted,
      isSelectedTab,
    };
  },
});
</script>

<style>
.fade-enter-active {
  transition: opacity 0.3s ease-out;
}
.fade-enter-from {
  opacity: 0;
}
.fade-enter-to {
  opacity: 1;
}
.tab-panel {
  border-right: 0px solid darkgray;
  border-bottom: 0px solid darkgray;
  height: 100%;
  overflow: hidden;
}
</style>
