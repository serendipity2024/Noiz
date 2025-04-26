import { resolveBrowserLocale, useSetLocale } from "ra-core";
import React from "react";
import { AppBar } from 'react-admin';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  spacer: {
    flex: 1
  },
  select: {
    color: 'white'
  },
})
const CustomAppBar = (props: any) => {
  const setLocale = useSetLocale();
  const classes = useStyles();
  const handleChange = (event: any) => {
    setLocale(event.target.value);
  }
  return (
    <AppBar {...props}>
      <span className={classes.spacer} />
      <Select onChange={handleChange} defaultValue={resolveBrowserLocale()} classes={{ select: classes.select }}>
        <MenuItem value={'en'}>English</MenuItem>
        <MenuItem value={'zh'}>中文</MenuItem>
      </Select>
    </AppBar>
  )
}

export default CustomAppBar;