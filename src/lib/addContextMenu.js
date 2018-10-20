import $ from 'jquery';

export default function addContextMenu(fn) {
  const doc = $(document);
  const pageTabs = $('.page-tabs .el-tabs__nav:first');
  const contextMenu = createContextMenu();
  let openTabMenu;

  $('body').append(contextMenu);
  doc.on('contextmenu', '.page-tabs .el-tabs__nav:first', (e) => {
    const tab = $(e.target).closest('.el-tabs__item');
    const name = tab.attr('id').replace('tab-', '');
    const index = tab.index();
    openTabMenu = {
      name,
      index
    };
    contextMenu.css({
      left: e.pageX,
      top: e.pageY
    }).show();
    return false;
  });
  doc.on('click', (e) => {
    const t = $(e.target);
    if (t.closest(contextMenu).length > 0) {
      const action = e.target.getAttribute('action-type');
      if (action) {
        fn(openTabMenu, action);
      } else {
        return;
      }
    }
    contextMenu.hide();
  });
  contextMenu.hide();
}

function createContextMenu() {
  const contextMenu = $([
    '<ul class="el-dropdown-menu el-popper" style="display: none;">',
      '<li tabindex="-1" class="el-dropdown-menu__item" action-type="closeAllTabs">关闭所有页签</li>',
      '<li tabindex="-1" class="el-dropdown-menu__item" action-type="closeOtherTabs">关闭其他页签</li>',
      '<li tabindex="-1" class="el-dropdown-menu__item" action-type="refreshCurrentTabs">刷新当前页签</li>',
    '</ul>'
  ].join(''));
  return contextMenu;
}
