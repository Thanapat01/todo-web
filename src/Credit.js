import SideBar from "./SideBar";

export default function Credit() {
  return (
    <div id="outer-container">
      <SideBar pageWrapId={"page-wrap"} outerContainerId={"outer-container"} />
      <div id="page-wrap">
        <center style={{ marginTop: "100px" }}>
          <h1>จัดทำโดย</h1>
          <h1>6234427023 ธนภัทร นาเจริญกุล</h1>
        </center>
      </div>
    </div>
  );
}
