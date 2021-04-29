import {
  useState,
  useEffect,
} from "react"
import {
  BrowserRouter,
  Route,
  Switch
} from "react-router-dom"
import {
  Typography,
  withStyles,
  MuiThemeProvider,
  Box,
  Card
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search';
import HomeIcon from '@material-ui/icons/Home';
import AdjustIcon from '@material-ui/icons/Adjust';
import HelpIcon from '@material-ui/icons/Help';
import ContactsIcon from '@material-ui/icons/Contacts';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { useMarkDown } from "./components/shared/fileutil"

import classNames from "classnames";
import AOS from "aos/dist/aos";

import theme from './theme'
import NavBar from './components/shared/navbar'
import WaveBorder from "./components/shared/WaveBorder"
import HelpPage from "./components/shared/HelpPage"
import MethodInfo from './components/method/method'
import PredictGrid from './components/method/predict-grid'
import QueryGrid from './components/method/query-grid'
import Footer from './components/shared/footer'


AOS.init({ once: true });



const styles = theme => ({
  mainarea: {
    backgroundColor: theme.palette.secondary.main,
  },
  extraLargeButtonLabel: {
    fontSize: theme.typography.body1.fontSize,
    [theme.breakpoints.up("sm")]: {
      fontSize: theme.typography.h6.fontSize,
    },
  },
  extraLargeButton: {
    paddingTop: theme.spacing(1.5),
    paddingBottom: theme.spacing(1.5),
    [theme.breakpoints.up("xs")]: {
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  },
  card: {
    boxShadow: theme.shadows[4],
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("xs")]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
    },
    [theme.breakpoints.up("sm")]: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: theme.spacing(5.5),
      paddingBottom: theme.spacing(5.5),
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(5),
    },
    [theme.breakpoints.up("lg")]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6),
      paddingLeft: theme.spacing(6),
      paddingRight: theme.spacing(6),
    },
    [theme.breakpoints.down("lg")]: {
      width: "auto",
    },
    // width: "100%"
  },
  wrapper: {
    position: "relative",
    backgroundColor: theme.palette.secondary.main,
    paddingBottom: theme.spacing(2),
  },
  container: {
    marginTop: theme.spacing(6),
    paddingBottom: theme.spacing(12),
    [theme.breakpoints.down("md")]: {
      paddingBottom: theme.spacing(9),
    },
    [theme.breakpoints.down("sm")]: {
      paddingBottom: theme.spacing(6),
    },
    [theme.breakpoints.down("sm")]: {
      paddingBottom: theme.spacing(3),
    },
  },
  waveBorder: {
    paddingTop: theme.spacing(4),
  },
} as const)



function App(props) {
  const {
    theme,
    classes
  } = props;

  const home = {
    link: "/",
    name: "Home",
    icon: <HomeIcon/>,
    imgpath: "/static/methodfig.png",
    mdpath: "/static/methodinfo.md"
  }
  const helps = {
      name: "HELP",
      icon: <MoreVertIcon/>,
      items: [
        {
          link: "/help/FAQ",
          name: "FAQ",
          icon: <HelpIcon/>,
          mdpath: "/static/helppages/faq.md",
        },
        {
          link: "/help/Contact",
          name: "Contacts",
          icon: <ContactsIcon/>,
          mdpath: "/static/helppages/contact.md",
        },
        {
          link: "/help/Usage",
          name: "Usage",
          icon: <HelpIcon/>,
          mdpath: "/static/helppages/usage.md",
        }
      ]
    }
  
  const menuItems = [
    home,
    {
      link: "/predict",
      name: "Predict",
      icon: <AdjustIcon/>,
    },
    {
      link: "/query",
      name: "DataBase",
      icon: <SearchIcon/>,
    },
    helps,
  ]
  let mdText = useMarkDown("/static/methodinfo.md")
  const apiAddr = "127.0.0.1"
  return (
    <>
      <BrowserRouter>
        <NavBar menuItems={menuItems} />
        <div className={classNames("container-fluid", classes.container, classes.wrapper)}>
          <Box display="flex" justifyContent="center" className="row">
            <Card
              className={classes.card}
              data-aos-delay="200"
              data-aos="zoom-in"
            >
              <Switch>
                <Route exact path="/">
                  <MethodInfo Title="Peak Finder" ImgPath={home.imgpath} MdPath={home.mdpath}/>
                </Route>
                <Route path="/predict">
                  <PredictGrid/>
                </Route>
                <Route path="/query">
                  <QueryGrid/>
                </Route>
                <Route path="/info">
                  <MethodInfo Title="Peak Finder"/>
                </Route>
                {helps.items.map(item => 
                  (
                    <Route key={item.name} path={item.link}>
                    <HelpPage MdPath={item.mdpath}/>
                    </Route>
                  )
                )}
              </Switch>
            </Card>
          </Box>
        </div>
        <WaveBorder
          upperColor={theme.palette.secondary.main}
          lowerColor="#FFFFFF"
          className={classes.waveBorder}
          animationNegativeDelay={2}
        />
        <Footer/>
      </BrowserRouter>
    </>
  )
}

export default withStyles(styles, { withTheme: true })(App);
