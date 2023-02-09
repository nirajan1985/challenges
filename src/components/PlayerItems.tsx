import React from "react";
import Grid from "@mui/material/Grid";

import { ItemsDefinition } from "types";
import { PlayerItemsList, Rows } from "./PlayerItemsList";
import { PlayerItemsSummary } from "./PlayerItemsSummary";

type PlayerItemsProps = {
  items: ItemsDefinition;
  onNewGame: () => void;
  playerItems: string[];
};

export const PlayerItems: React.FC<PlayerItemsProps> = ({
  items,
  onNewGame,
  playerItems,
}) => {
  const rows: Rows = React.useMemo(
    () => calculateRows(items, playerItems),
    [items, playerItems]
  );
  const [bonuses, total] = React.useMemo(
    () =>
      Object.values(rows).reduce(
        ([bonus, total]: [number, number], current) => [
          bonus + current.bonus,
          total + current.bonus + current.score,
        ],
        [0, 0]
      ),
    [rows]
  );

  return (
    <Grid
      container
      direction="column"
      sx={{
        height: "100%",
        overflow: "hidden",
      }}
      alignItems="stretch"
      spacing={1}
      flexWrap="nowrap"
    >
      <Grid
        item
        flexGrow={1}
        sx={{
          overflow: "auto",
        }}
      >
        <PlayerItemsList rows={rows} />
      </Grid>
      <Grid item>
        <PlayerItemsSummary
          bonuses={bonuses}
          onNewGame={onNewGame}
          total={total}
        />
      </Grid>
    </Grid>
  );
};

function calculateRows(items: ItemsDefinition, playerItems: string[]): Rows {
  const rows: Rows = {};
  const possiblePlayerItems = playerItems.filter((key) => key in items);

  for (const key of possiblePlayerItems) {
    const itemDefinition = items[key];
    let row = rows[key]
      ? rows[key]
      : { item: itemDefinition, count: 0, score: 0, bonus: 0 };
    const count = row.count + 1;
    const bonus = itemDefinition.bonus;

    rows[key] = {
      item: itemDefinition,
      count: count,
      score: count * itemDefinition.value,
      bonus: bonus && count >= bonus.count ? bonus.amount : 0,
    };
  }
  return rows;
}
