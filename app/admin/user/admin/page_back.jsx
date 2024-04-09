"use client";
import React from "react";
import { useState, useEffect } from "react";
import { customAlert, uf_appendFileToFormData } from "@/components/common/util/Util";
import Axios from "@/components/common/api/Axios";
import cn from 'classnames'
import { FileSample } from "@/components/File/Sample";


const AdminUser = () => {
  return (
    <>
      <text>관리자 페이지</text>
      <FileSample />
    </>
  );
};

export default AdminUser;