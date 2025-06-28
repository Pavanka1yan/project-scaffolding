#!/usr/bin/env node
'use strict';

require('../lib/cli').run().catch((err) => {
  console.error(`CLI failed: ${err.message}`);
  process.exit(1);
});
