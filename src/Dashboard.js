import React from "react";
import SummaryCard from "./SummaryCard";
import ChartComponent from "./ChartComponent";
import TemplateLayout from "./Layout.js";
import { Layout } from "antd";

const { Content } = Layout;

function Dashboard() {
  return (
    <TemplateLayout>
      <Content>
        <div className="summary-cards">
          <SummaryCard
            title="Total Sales"
            value="$1,234,567"
            icon="attach_money"
          />
          <SummaryCard title="Total Users" value="5,678" icon="people" />
          {/* Add more summary cards as needed */}
        </div>
        <ChartComponent />
      </Content>
    </TemplateLayout>
  );
}

export default Dashboard;
