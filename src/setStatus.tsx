import { useEffect, useState } from "react";
import { Action, ActionPanel, List } from "@raycast/api";
import fetch from "node-fetch";

const items = ["online", "away", "busy", "offline"];

const apiData = {
  uri: "https://",
  xAuthToken: "",
  xUserId: "",
};

export default function StatusList() {
  const [curStatus, setCurStatus] = useState("");

  const handle = async () => {
    const data = await fetch(`${apiData.uri}/api/v1/users.getStatus`, {
      method: "GET",
      headers: {
        "X-Auth-Token": apiData.xAuthToken,
        "X-User-Id": apiData.xUserId,
      },
    });
    const res: any = await data.json();
    setCurStatus(res?.status);
  };

  const handleStatusChange = async (status) => {
    setCurStatus(status);
    const data = await fetch(`${apiData.uri}/api/v1/users.setStatus`, {
      method: "POST",
      headers: {
        "X-Auth-Token": apiData.xAuthToken,
        "X-User-Id": apiData.xUserId,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status, message: status }),
    });
    const res = await data.json();
    handle();
  };

  useEffect(() => {
    handle();
  }, []);
  return (
    <List>
      <List.Section title="Current Status">
        <List.Item title={curStatus} />
      </List.Section>
      <List.Section title="Set Status">
        {items.map((item) => (
          <List.Item
            key={item}
            title={item}
            actions={
              <ActionPanel>
                <Action title="Select" onAction={() => handleStatusChange(item)} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
}
