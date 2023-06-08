import { useState } from 'react';
// @mui
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Divider, Drawer, Stack, Typography, Tooltip, IconButton } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// config
import { NAV } from '../../../config-global';
//
import Iconify from '../../iconify';
import Scrollbar from '../../scrollbar';
//
import { defaultSettings } from '../config-setting';
import { useSettingsContext } from '../SettingsContext';
import Block from './Block';
import BadgeDot from './BadgeDot';
import ToggleButton from './ToggleButton';
import ModeOptions from './ModeOptions';
import LayoutOptions from './LayoutOptions';
import StretchOptions from './StretchOptions';
import ContrastOptions from './ContrastOptions';
import DirectionOptions from './DirectionOptions';
import FullScreenOptions from './FullScreenOptions';
import ColorPresetsOptions from './ColorPresetsOptions';

// ----------------------------------------------------------------------

const SPACING = 2.5;

export default function SettingsDrawer() {
  const {
    themeMode,
    themeLayout,
    themeStretch,
    themeContrast,
    themeDirection,
    themeColorPresets,
    onResetSetting,
  } = useSettingsContext();

  const theme = useTheme();

  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const notDefault =
    themeMode !== defaultSettings.themeMode ||
    themeLayout !== defaultSettings.themeLayout ||
    themeStretch !== defaultSettings.themeStretch ||
    themeContrast !== defaultSettings.themeContrast ||
    themeDirection !== defaultSettings.themeDirection ||
    themeColorPresets !== defaultSettings.themeColorPresets;

  
}
