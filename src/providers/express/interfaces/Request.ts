import express from 'express';
import { IncomingHttpHeaders } from 'http';

export interface IRequest extends express.Request {
  headers: IncomingHttpHeaders & {
    tracking?: any;
  };
}
