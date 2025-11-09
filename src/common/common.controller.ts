// src/common/base.controller.ts
import { Request, Response } from "express";
import { success, fail } from "./common.response";
import { CommonService } from "./common.service";

export abstract class CommonController<T> {
  protected service: CommonService<T>;

  constructor(service: CommonService<T>) {
    this.service = service;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getAll();
      res.json(success(data));
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const data = await this.service.getById(req.params.id);
      if (!data) return res.status(404).json(fail("Not Found"));
      res.json(success(data));
    } catch (error: any) {
      res.status(500).json(fail(error.message));
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json(success(data, "Created"));
    } catch (error: any) {
      res.status(400).json(fail(error.message));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const data = await this.service.update(req.params.id, req.body);
      res.json(success(data, "Updated"));
    } catch (error: any) {
      res.status(400).json(fail(error.message));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      await this.service.delete(req.params.id);
      res.json(success(null, "Deleted"));
    } catch (error: any) {
      res.status(400).json(fail(error.message));
    }
  };
}
