#!/usr/bin/env node

// Prevent exiting with code 1 when
// the changeset PR is created
// @ts-expect-error This is a hack to prevent the process from exiting
process.exit = (): never => {};

import { getBinary } from './get-binary.js';
getBinary().install();
