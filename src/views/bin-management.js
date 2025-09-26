import React from "react";

import { Helmet } from "react-helmet";

import Navigation from "../components/navigation";
import "./bin-management.css";

const BinManagement = (props) => {
  return (
    <div className="bin-management-container1">
      <Helmet>
        <title>Bin-Management - WasteWise</title>
        <meta property="og:title" content="Bin-Management - WasteWise" />
      </Helmet>
      <Navigation></Navigation>
    </div>
  );
};

export default BinManagement;
