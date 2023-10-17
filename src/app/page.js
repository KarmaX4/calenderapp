"use client";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  NativeSelect,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import eventData from "./events.json";

const timesOfDay = [];
for (let hour = 8; hour <= 23; hour++) {
  for (let minute = 0; minute < 60; minute += 30) {
    const period = hour < 12 ? "AM" : "PM";
    const hour12 = hour <= 12 ? hour : hour - 12;
    const time = `${hour12.toString().padStart(2, "0")}:${
      minute === 0 ? "00" : minute
    } ${period}`;
    timesOfDay.push(time);
  }
}

export default function Home() {
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [utc, setUTC] = useState(0);
  
  const currentDate = new Date();
  const handleTimeChange = (date, time) => {
    const newSelection = `${date}-${time}`;
    setSelectedTimes((prevSelectedTimes) => {
      if (prevSelectedTimes.includes(newSelection)) {
        return prevSelectedTimes.filter(
          (selected) => selected !== newSelection
        );
      } else {
        return [...prevSelectedTimes, newSelection];
      }
    });
  };

  const options = { year: "numeric", month: "short", day: "numeric" };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(
    currentDate
  );

  
  const currentWeekDates = getCurrentWeekDates(currentWeek);

  const handleNextWeek = () => {
    setCurrentWeek(currentWeek - 1);
  };

  const handlePreviousWeek = () => {
    setCurrentWeek(currentWeek + 1);
  };
  useEffect(() => {
    const formattedData = eventData?.map((item) => {
      const dateTime = new Date(item.Date + "T" + item.Time);
      const year = dateTime.getFullYear();
      const month = String(dateTime.getMonth() + 1).padStart(2, "0");
      const day = String(dateTime.getDate()).padStart(2, "0");
      let hours = dateTime.getHours();
      const minutes = String(dateTime.getMinutes()).padStart(2, "0");
      let period = "AM";

      let updatedHours = hours + parseInt(utc, 10); // Convert to integers

      if (updatedHours > 12) {
        updatedHours -= 12;
        period = "PM";
      }

      const formattedHours = String(updatedHours).padStart(2, "0");

      const formattedDateTime = `${year}-${month}-${day}-${formattedHours}:${minutes} ${period}`;
      return formattedDateTime;
    });
    const jsonData = formattedData;
    jsonData && setSelectedTimes(jsonData);
  }, [utc]);
  return (
    <Box
      sx={{
        width: "80vw",
        m: "auto",
      }}>
      <Grid container>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
          <Button onClick={handlePreviousWeek}>Previous Week</Button>
          <Typography>{formattedDate}</Typography>
          <Button onClick={handleNextWeek}>Next Week</Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <Typography
              sx={{
                fontWeight: "bold",
              }}>
              TimeZone:
            </Typography>
            <NativeSelect
              value={utc}
              onChange={(e) => setUTC(e.target.value)}
              // defaultValue={30}
              inputProps={{
                name: "age",
                id: "uncontrolled-native",
              }}>
              <option value={0}>[UTC +0] Eastern Standard Time</option>
              <option value={5}>[UTC +5] Eastern Standard Time</option>
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12} mt={5}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {currentWeekDates.map((week, index) => {
                // Use currentWeekDates here
                const currentDate = new Date();
                const currentDay = new Date(
                  week.year,
                  week.month - 1,
                  week.date
                );
                const isPastDate = currentDay < currentDate;
                const isCurrentDate =
                  currentDay.toDateString() === currentDate.toDateString();
                return (
                  <Grid
                    container
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      my: 1,
                    }}>
                    <Grid item xs={1}>
                      <Typography>{week.day}</Typography>
                      <Typography>{`${week.month}/${week.date}`}</Typography>
                    </Grid>
                    <Grid item xs={11}>
                      <Grid container>
                        {!isPastDate ? (
                          timesOfDay.map((time, index) => (
                            <Grid
                              item
                              key={index}
                              xs={5}
                              sm={4}
                              md={3}
                              lg={2}
                              xl={1}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedTimes.includes(
                                      `${week.year}-${week.month}-${week.date}-${time}`
                                    )}
                                    onChange={() =>
                                      handleTimeChange(
                                        `${week.year}-${week.month}-${week.date}`,
                                        time
                                      )
                                    }
                                    name={time}
                                  />
                                }
                                label={time}
                              />
                            </Grid>
                          ))
                        ) : isCurrentDate ? (
                          timesOfDay.map((time, index) => (
                            <Grid
                              item
                              key={index}
                              xs={5}
                              sm={4}
                              md={3}
                              lg={2}
                              xl={1}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={selectedTimes.includes(
                                      `${week.year}-${week.month}-${week.date}-${time}`
                                    )}
                                    onChange={() =>
                                      handleTimeChange(
                                        `${week.year}-${week.month}-${week.date}`,
                                        time
                                      )
                                    }
                                    name={time}
                                  />
                                }
                                label={time}
                              />
                            </Grid>
                          ))
                        ) : (
                          <Typography>Past</Typography>
                        )}
                      </Grid>
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

const getCurrentWeekDates = (currentWeek) => {
  const currentDate = new Date();
  const currentDayOfWeek = currentDate.getDay();
  const mondayDate = new Date(currentDate);
  mondayDate.setDate(
    currentDate.getDate() - currentWeek * 7 - currentDayOfWeek + 1
  );

  const weekDates = [];

  for (let i = 0; i < 5; i++) {
    const dayDate = new Date(mondayDate);
    dayDate.setDate(mondayDate.getDate() + i);

    const day = dayDate.toLocaleDateString("en-US", { weekday: "short" });
    const month = dayDate.getMonth() + 1;
    const date = dayDate.getDate();
    const year = dayDate.getFullYear();

    const dateObject = {
      day,
      month,
      date,
      year,
    };

    weekDates.push(dateObject);
  }

  return weekDates;
};
