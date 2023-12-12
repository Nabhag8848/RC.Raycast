import { useEffect, useState } from "react";
import { Action, ActionPanel, List } from "@raycast/api";
import fetch from "node-fetch";

const items = ["online", "away", "busy", "offline"];

export default function StatusList() {
  const [filteredList, filterList] = useState(items);
  const [curStatus, setCurStatus] = useState("");

  const handle = async () => {
    const data = await fetch("/api/v1/users.getStatus", {
      method: "GET",
      headers: {
        "X-Auth-Token": "",
        "X-User-Id": "",
      },
    });
    const res = await data.json();
    setCurStatus(res?.status);
  };

  const handleStatusChange = async (status) => {
    setCurStatus(status)
    const data = await fetch("/api/v1/users.setStatus", {
      method: "POST",
      headers: {
        "X-Auth-Token": "",
        "X-User-Id": "",
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
        {filteredList.map((item) => (
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
