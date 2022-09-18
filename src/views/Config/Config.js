import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import {
  Button,
  Select,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  Typography,
  MenuItem,
  Divider,
  Grid,
  Switch,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from "@material-ui/core";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import apis from "apis";
import { string } from "prop-types";

const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(4)
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    maxWidth: "300px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis"
  },
  desc: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  input: {
    display: "flex",
    alignItems: "center"
  },
  inputItem: {
    width: "100%"
  },
  inputBtn: {
    marginLeft: theme.spacing(2)
  },
  gutterTop: {
    marginTop: theme.spacing(2)
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  actions: {
    justifyContent: "center"
  },
  noMaxWidth: {
    maxWidth: "none"
  }
}));

function SingleInputItem({
                           placeholder = "",
                           initValue = "",
                           initKey = "",
                           type = "input",
                           options = [],
                           multiline = false,
                           reload = () => {
                           }
                         }) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue(initValue);
  }, [initValue]);

  const doSave = () => {
    apis.setConfig({ key: initKey, value }).then(res => {
      if (res.status === 0) {
        enqueueSnackbar("修改成功", {
          variant: "success",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      } else {
        enqueueSnackbar(res.errorMessage || res.message, {
          variant: "error",
          anchorOrigin: {
            vertical: "top",
            horizontal: "center"
          }
        });
      }
      reload();
    }).catch(e => console.log(e));
  };

  return (
    <Grid item xs={12} className={classes.input}>
      {
        type === "input" ? (
          <TextField
            className={classes.inputItem}
            multiline={multiline}
            rows={multiline ? 4 : undefined}
            size="small"
            variant="outlined"
            placeholder={placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}/>
        ) : null
      }
      {
        type === "switch" ? (
          <Switch
            checked={value || false}
            onChange={(e) => setValue(e.target.checked)}
            inputProps={{ "aria-label": "secondary checkbox" }}
          />
        ) : null
      }
      {
        type === "select" ? (
          <Select
            className={classes.inputItem}
            variant="outlined"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          >
            {options.map(item => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        ) : null
      }
      <Button className={classes.inputBtn} variant="contained" color="primary" onClick={doSave}>保存</Button>
    </Grid>
  );
}

const Form = () => {

  const classes = useStyles();
  const [configs, setConfigs] = useState({});

  const [refresh, setRefresh] = useState(+new Date());

  const CONFIGS = [
    {
      key: "majora.global.maxWhiteIpPerUser",
      name: "每个用户最大的白名单数量",
      desc: "单个账户下白名单配置数量存在上限，用以避免用户无限的配置白名单，正常情况单个用户白名单数量不超过200是一个合适的数值",
      component: (
        <SingleInputItem
          placeholder="数字，默认40"
          initKey="majora.global.maxWhiteIpPerUser"
          initValue={configs["majora.global.maxWhiteIpPerUser"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "majora.alert.urlTemplate",
      name: "敏感事件通知webhook",
      desc: "系统敏感事件通知webhook，包括他判定的报警事件、敏感API操作等。可以将这些数据接入到微信、钉钉等运维群聊中",
      component: (
        <SingleInputItem
          placeholder="url"
          initKey="majora.alert.urlTemplate"
          initValue={configs["majora.alert.urlTemplate"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "majora.access_record",
      name: "是否记录用户访问日志",
      desc: "记录用户访问日志后，系统将会存储所有用户的访问记录，记录每个小时、每个用户、访问每个网站的次数，本记录不会存在性能问题",
      component: (
        <SingleInputItem
          type={"switch"}
          placeholder="默认true"
          initKey="majora.access_record"
          initValue={configs["majora.access_record"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "majora.outIpResolveUrl",
      name: "出口ip探测URL",
      desc: "用户解析服务器节点的出口ip，需要该URL返回出口ip地址",
      component: (
        <SingleInputItem
          placeholder="出口ip探测URL"
          initKey="majora.outIpResolveUrl"
          initValue={configs["majora.outIpResolveUrl"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "malenia.systemNotice",
      name: "系统通告信息",
      desc: "将会将文本推送到每个用户avatar",
      component: (
        <SingleInputItem
          placeholder="系统通告信息"
          initKey="malenia.systemNotice"
          initValue={configs["malenia.systemNotice"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "malenia.docNotice",
      name: "文档首页通告信息",
      desc: "文档首页通告信息，在文档首页渲染的一个html片段，一般用于指定联系方式（支持二维码等）",
      component: (
        <SingleInputItem
          placeholder="文档首页通告信息"
          initKey="malenia.docNotice"
          initValue={configs["malenia.docNotice"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "majora.config.proxySpace",
      name: "代理端口范围",
      desc: "代理端口范围，系统将会在这些端口开放代理服务（http/socks），本范围代理将会执行一致性哈希路由策略",
      component: (
        <SingleInputItem
          placeholder="代理端口范围，如：30000-30100"
          initKey="majora.config.proxySpace"
          initValue={configs["majora.config.proxySpace"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "majora.config.natPort",
      name: "客户端连接端口",
      desc: "客户端连接端口",
      component: (
        <SingleInputItem
          placeholder="客户端连接端口"
          initKey="majora.config.natPort"
          initValue={configs["majora.config.natPort"]}
          reload={() => setRefresh(+new Date())}/>
      )
    },
    {
      key: "majora.config.staticBindingPortSpace",
      name: "永久绑定端口范围",
      desc: "永久绑定端口范围，用于给终端自动分配固定绑定端口资源，终端和端口确认绑定后绑定关系将会存储到数据库，直到后台手动接触绑定，默认值为空，为空或者端口资源全部分配，则不再为新终端执行静态绑定",
      component: (
        <SingleInputItem
          placeholder="永久绑定端口范围，如：30000-30100"
          initKey="majora.config.staticBindingPortSpace"
          initValue={configs["majora.config.staticBindingPortSpace"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }, {
      key: "majora.config.usingConsistentRouteWhenStaticOffline",
      name: "静态端口在设备下线时使用一致性哈希",
      desc: "对于静态端口绑定，端口为特定设备服务，然而当对应设备下线时，开启此策略将会使用其他设备端口进行路由，关闭此策略则代理访问失败",
      component: (
        <SingleInputItem
          type={"switch"}
          placeholder="默认false"
          initKey="majora.config.usingConsistentRouteWhenStaticOffline"
          initValue={configs["majora.config.usingConsistentRouteWhenStaticOffline"]}
          reload={() => setRefresh(+new Date())}/>
      )
    }
  ];

  useEffect(() => {
    apis.allConfig().then(res => {
      if (res.status === 0) {
        setConfigs(res.data);
      }
    }).catch(e => console.log(e));
  }, [refresh]);

  if (Object.keys(configs).length === 0) {
    return null;
  }

  return (
    <Card className={classes.root}>
      <CardHeader title="系统设置" action={(
        <CardActions className={classes.actions}>
          {/* <Button variant="contained" color="primary" onClick={doSave}>保存</Button> */}
        </CardActions>
      )}></CardHeader>
      <Divider/>
      <CardContent>
        {CONFIGS.map((item, index) => (
          <Accordion key={"panel" + index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
              <Typography className={classes.heading}>{item.name}</Typography>
              <Typography className={classes.secondaryHeading}>{"" + configs[item.key]}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <div style={{ width: "100%" }}>
                <Typography className={classes.desc}>填写说明：{item.desc}</Typography>
                <Divider className={classes.divider}/>
                <Grid container spacing={6} wrap="wrap">
                  {item.component}
                </Grid>
              </div>
            </AccordionDetails>
          </Accordion>
        ))}
      </CardContent>
    </Card>
  );
};

export default Form;
