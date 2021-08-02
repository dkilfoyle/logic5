import { reactive, computed, nextTick } from 'vue';

export interface TabInterface {
  name: string;
  icon: string;
  label: string;
  isDisabled: boolean;
}

export interface DragDropAction {
  sourceTabsId: string;
  sourceTabIndex: number;
  targetTabsId: string;
  targetTabIndex: number;
}

const state = reactive({
  tabBars: {} as {
    [index: string]: {
      selected: string;
      tabs: Array<TabInterface>;
    };
  },
});

export default () => {
  const tabBarNames = computed(() => Object.keys(state.tabBars));

  const addTab = (tabBarId: string, tab: TabInterface): void => {
    if (!state.tabBars[tabBarId])
      state.tabBars[tabBarId] = { tabs: [], selected: '' };
    state.tabBars[tabBarId].tabs.push(tab);
  };

  const getTab = (tabId: string): TabInterface | null => {
    for (const tabBar of tabBarNames.value) {
      const found = state.tabBars[tabBar].tabs.find((x) => x.name == tabId);
      if (found) return found;
    }
    return null;
  };
  const getTabs = (tabBarId: string) => {
    if (!state.tabBars[tabBarId])
      console.log(`getTabs(${tabBarId}): invalid tabBarId`);
    return state.tabBars[tabBarId]?.tabs || [];
  };

  const getState = () => state;

  const setSelectedTab = (tabBarId: string, tabId: string): void => {
    state.tabBars[tabBarId].selected = tabId;
  };
  const getSelectedTab = (tabBarId: string): string =>
    state.tabBars[tabBarId].selected;

  const isSelectedTab = (tabId: string): boolean => {
    return getSelectedTab(getTabBarIdForTab(tabId)) == tabId;
  };

  const getTabBarIdForTab = (tabId: string): string => {
    for (const tabBarId of tabBarNames.value) {
      if (state.tabBars[tabBarId].tabs.some((x) => x.name == tabId))
        return tabBarId;
    }
    return '';
  };

  const doDragDrop = async (dropResult: DragDropAction): Promise<void> => {
    const { sourceTabsId, sourceTabIndex, targetTabsId, targetTabIndex } =
      dropResult;
    
      console.log('doDragDrop: ', dropResult);
    const targetTabs = getTabs(targetTabsId);
    const sourceTabs = getTabs(sourceTabsId);

    // this will unselect/hide the currently selected tab in targettabs
    setSelectedTab(targetTabsId, sourceTabs[sourceTabIndex].name);
    await nextTick(); // wait for the hide so that when teleported only 1 tab visible to calculate height

    // move the tab object from sourceTabs to targetTabs array
    // this will trigger the teleport
    const itemToAdd = sourceTabs.splice(sourceTabIndex, 1)[0];
    targetTabs.splice(targetTabIndex, 0, itemToAdd);

    if (sourceTabIndex > 0)
      // there are tabs to the left so select the sourceTabIndex-1
      state.tabBars[sourceTabsId].selected =
        sourceTabs[sourceTabIndex - 1].name;
    // no tabs to the left - could be 0 or more tabs to the right
    else
      state.tabBars[sourceTabsId].selected =
        sourceTabs.length > 0 ? sourceTabs[sourceTabIndex].name : '';
  };

  return {
    addTab,
    getTab,
    getTabs,
    setSelectedTab,
    getSelectedTab,
    isSelectedTab,
    getTabBarIdForTab,
    doDragDrop,
    tabBarNames,
    getState,
  };
};
