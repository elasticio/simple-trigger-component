# Simple trigger Component

## Table of Contents

* [Description](#description)
* [Actions](#actions) 
* [Triggers](#triggers) 
  * [Webhook](#webhook)

## Description

A component used to trigger integration flows without requesting data from any services.

## Actions

None.

## Triggers 

### Simple trigger

Send message with information when this and previous message was send

#### Configuration Fields
* **Start Time** - (string, optional): The timestamp to start sending messages from (inclusive) - using ISO 8601 Date time utc format - YYYY-MM-DDThh:mm:ss.sssZ. Default value is the beginning of time (January 1, 1970 at 00:00).
* **End Time** - (string, optional): The timestamp to stop sending messages (exclusive) - using ISO 8601 Date time utc format - YYYY-MM-DDThh:mm:ss.sssZ. Default to never.


#### Input Metadata

None.

#### Output Metadata

* **fireTime** - (string, required): The timestamp when trigger was executed in ISO 8601 Date time format - YYYY-MM-DDThh:mm:ss.sssZ.
* **lastPoll** - (string, required): Previous execution timestamp in ISO 8601 Date time utc format - YYYY-MM-DDThh:mm:ss.sssZ
