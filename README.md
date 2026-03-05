# Simple Trigger Component

A lightweight and efficient component designed to trigger integration flows on a scheduled basis without requiring external data sources. Ideal for heartbeat signals, periodic tasks, or orchestrating flows that don't depend on incoming data payloads.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Triggers](#triggers)
    - [Simple Trigger](#simple-trigger)

## Overview

The Simple Trigger Component provides a reliable way to initiate elastic.io platform flows. It emits a message containing the current execution time and the timestamp of the previous successful execution, allowing for time-windowed logic in subsequent steps.

## Features

- **Time-Windowed Triggers:** Leverages snapshots to track polling history.
- **Configurable Range:** Set specific start and end boundaries for trigger activation.
- **Offset Support:** Automatically defaults to the beginning of Unix time if no prior state exists.

## Triggers

### Simple Trigger

The primary trigger that emits a heartbeat message with polling metadata.

#### Configuration Fields

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| **Start Time** | String | No | The ISO 8601 timestamp to start sending messages (e.g., `2023-01-01T00:00:00.000Z`). Defaults to `1970-01-01T00:00:00.000Z`. |
| **End Time** | String | No | The ISO 8601 timestamp to stop sending messages. Once reached, the trigger will cease emitting data. |

#### Output Metadata

Each emitted message contains the following body fields:

- **fireTime:** (String) The exact UTC timestamp when the trigger was executed.
- **lastPoll:** (String) The timestamp of the previous successful execution (or the `Start Time` if it's the first run).
