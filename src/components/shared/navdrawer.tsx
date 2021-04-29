import {useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {
  withStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  Typography,
  Toolbar,
  withWidth,
  isWidthUp,
  Collapse
} from '@material-ui/core'
import CloseIcon from "@material-ui/icons/Close"
import {
  ExpandLess,
  ExpandMore
} from "@material-ui/icons"

const styles = theme => ({
  submenuItems: {
  },
  noDecoration: {
    textDecoration: "none !important",
    color: "grey",
  },
  headSection: {
    width: 200,
  },
  closeIcon: {
  }
})


function TabListItem(props) {
  const { classes, theme, item, selectedItem } = props;
  return (
      <ListItem
        button
        className={classes.noDecoration}
        selected={selectedItem === item.name}
        style={{alignItems: 'center'}}
        // disableRipple
        // disableTouchRipple
        
        {...props}
      >
        <ListItemIcon>{item.icon}</ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="subtitle1">
              {item.name}
            </Typography>
          }
        />
        {props.children}
      </ListItem>
  )
}

function LinkTabListItem(props) {
  const { classes, theme, item, setItem } = props;
  return (
    <Link
      key={item.name}
      to={item.link}
      className={classes.noDecoration}
      onClick={() => setItem(item.name)}
    >
      <TabListItem {...props}></TabListItem>
    </Link>
  )
}

function NavigationDrawer(props) {
  const {
    width,
    menuItems, selectedItem, setItem,
    open, onClose, anchor,
    classes, theme
  } = props;

  const [openedTab, openTab] = useState("")

  useEffect(() => {
    if (isWidthUp("sm", width) && open) {
      onClose();
    }
  }, [width, open, onClose]);

  let flipTab = (itemname) => {
    if (itemname === openedTab)
      openTab("");
    else
      openTab(itemname);
  }

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      anchor={anchor}>
      <Toolbar className={classes.headSection}>
        <ListItem
          style={{
            paddingTop: theme.spacing(0),
            paddingBottom: theme.spacing(0),
            height: "100%",
            justifyContent: anchor === "left" ? "flex-start" : "flex-end"
          }}
          disableGutters
        >
          <ListItemIcon className={classes.closeIcon}>
            <IconButton onClick={onClose} aria-label="Close Navigation">
              <CloseIcon color="primary"/>
            </IconButton>
          </ListItemIcon>
        </ListItem>
      </Toolbar>

      <List className={classes.menuItems}>
        {menuItems.map((item) => {
          return Array.isArray(item.items) ?
            (
              <div key={item.name}>
                <TabListItem item={item} {...props} onClick={() => flipTab(item.name)}>
                  {openedTab === item.name ? <ExpandLess/> : <ExpandMore/>}
                </TabListItem>
                <Collapse in={openedTab === item.name} timeout="auto">
                  <List className={classes.submenuItems} component="div">
                    {item.items.map(item => 
                      <LinkTabListItem key={item.name} item={item} {...props}/>
                    )}
                  </List>
                </Collapse>
              </div>
            )
            : <LinkTabListItem key={item.name} item={item} {...props}/>;
        })}
      </List>
    </Drawer>
  )
}

export default withStyles(styles, { withTheme: true })(NavigationDrawer);