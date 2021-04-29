import React, { useState, useCallback } from 'react';
import {Link} from "react-router-dom"
import {
  AppBar,
  Toolbar,
  Typography,
  Hidden,
  IconButton,
  withStyles,
  Tabs,
  Tab,
} from "@material-ui/core"
import MenuIcon from "@material-ui/icons/Menu"

import NavigationDrawer from './navdrawer'


const styles = theme => ({
  appBar: {
    boxShadow: theme.shadows[6],
    backgroundColor: theme.palette.common.white,
    flexGrow: 1,
  },
  brand: {
    fontFamily: "'Baloo Bhaijaan', cursive",
    fontWeight: 400
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  menuItems: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  }
} as const)

function NavBar(props) {
  const {
    classes,
    menuItems,
  } = props;
  const [activatedTab, setTab] = useState(menuItems[0].name)
  const [drawerOpen, setDrawer] = useState(false)
  

  return (
      <AppBar position="sticky" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <div className={classes.brand}>
            <Typography
              className={classes.brand}
              variant="h4"
              display="inline"
              color="primary"
            >
              Peak
            </Typography>
            <Typography
              className={classes.brand}
              variant="h4"
              display="inline"
              color="secondary"
            >
              Sniffer
            </Typography>
          </div>
          <div className={classes.menuItems}>
            <Hidden smDown>
              <Tabs
                indicatorColor="primary"
                textColor="secondary"
                selectionFollowsFocus={true}
                value={activatedTab}
                onChange={(e, newtab) => setTab(newtab)}
              >
              {menuItems.map(item => {
                return item.link ?
                  (
                    <Tab
                      key={item.name}
                      component={Link}
                      label={item.name}
                      value={item.name}
                      to={item.link}
                      >
                    </Tab>
                  ) :
                  (
                    item.items.map(item =>
                      <Tab
                        key={item.name}
                        style={{ display: "none" }}
                        value={item.name}
                        component="a"
                      ></Tab>
                    )
                  )
                })}.flattern()
              </Tabs>
            </Hidden>
            <IconButton
              className={classes.menuButton}
              onClick={() => setDrawer(true)}
              aria-label="Open Navigation"
            >
              <MenuIcon color="primary"></MenuIcon>
            </IconButton>
          </div>
        </Toolbar>
      <NavigationDrawer
        menuItems={menuItems}
        selectedItem={activatedTab}
        setItem={setTab}
        open={drawerOpen}
        onClose={() => setDrawer(false)}
        anchor="right"
      >
      </NavigationDrawer>
      </AppBar>
  )
}


export default withStyles(styles, { withTheme: true })(NavBar);