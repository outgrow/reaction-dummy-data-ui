import React from "react";
import { withApollo } from "react-apollo";
import CodeBracesBox from "mdi-material-ui/CodeBracesBox";
import { registerOperatorRoute } from "/imports/client/ui";
import { DummyData } from "../components";

registerOperatorRoute({
  group: "navigation",
  mainComponent: DummyData,
  hocs: [
    withApollo
  ],
  path: "/dummy-data",
  // eslint-disable-next-line react/display-name
  SidebarIconComponent: (props) => <CodeBracesBox {...props} />,
  sidebarI18nLabel: "dummyDataSetting.sidebarLabel"
});
