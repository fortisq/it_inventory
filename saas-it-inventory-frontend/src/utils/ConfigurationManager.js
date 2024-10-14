// ConfigurationManager.js
export const applyConfigurations = (configurations) => {
  // Apply navigation bar color
  if (configurations.nav_bar_color) {
    document.documentElement.style.setProperty('--nav-bar-color', configurations.nav_bar_color);
  }

  // Apply navigation text color
  if (configurations.nav_text_color) {
    document.documentElement.style.setProperty('--nav-text-color', configurations.nav_text_color);
  }

  // Apply application title
  if (configurations.application_title) {
    document.title = configurations.application_title;
  }

  // Apply other global styles or configurations as needed
  if (configurations.assets_table_color) {
    document.documentElement.style.setProperty('--assets-table-color', configurations.assets_table_color);
  }

  if (configurations.assets_table_header_color) {
    document.documentElement.style.setProperty('--assets-table-header-color', configurations.assets_table_header_color);
  }

  if (configurations.assets_table_row_color) {
    document.documentElement.style.setProperty('--assets-table-row-color', configurations.assets_table_row_color);
  }
};

export const getConfigValue = (configurations, key, defaultValue) => {
  return configurations[key] || defaultValue;
};

export const getNavLinks = (configurations) => {
  const defaultLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Assets', path: '/assets' },
    { name: 'Inventory', path: '/inventory' },
    { name: 'Reports', path: '/reports' },
    { name: 'Configuration', path: '/configuration' },
  ];

  return defaultLinks.map(link => ({
    ...link,
    name: getConfigValue(configurations, `nav_link_${link.name.toLowerCase()}`, link.name)
  }));
};
