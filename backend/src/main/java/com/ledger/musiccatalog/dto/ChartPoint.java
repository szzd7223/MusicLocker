package com.ledger.musiccatalog.dto;

/** A frontend-ready label/value pair for a bar, pie, line, or histogram chart. */
public record ChartPoint(String label, long value) { }
