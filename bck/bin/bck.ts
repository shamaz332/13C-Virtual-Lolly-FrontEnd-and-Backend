#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { BckStack } from '../lib/bck-stack';

const app = new cdk.App();
new BckStack(app, 'BckStack');
