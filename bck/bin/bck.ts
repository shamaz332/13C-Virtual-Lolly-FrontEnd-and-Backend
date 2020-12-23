#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BckLolly } from '../lib/bck-stack';

const app = new cdk.App();
new BckLolly(app, 'BckStack');
