// components/Form.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";

import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Button } from "./ui/button";

const formSchema = z.object({
  title: z.string().min(1).max(50),
  url: z.string().url(),
});

const FormComponent: React.FC = () => {
  const [submittedData, setSubmittedData] = useState<
    { title: string; url: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const { title, url } = data;
    try {
      await axios.post("/api/writeUrls", { title, url });
      form.reset({
        title: "",
        url: "",
      });
      console.log("Data written successfully");
      toast.success("Data written successfully");

      // Update the submittedData state with the new data
      setSubmittedData((prevData) => [...prevData, { title, url }]);
    } catch (error) {
      console.error("Failed to write data:", error);
    }
  });

  return (
    <div className="flex flex-col items-center justify-center p-24">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="text"
                    className="text-sm text-gray-700 p-2 rounded w-[250px]"
                    placeholder="Enter a title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input
                    type="text"
                    className="text-gray-700 text-sm p-2 rounded w-[250px]"
                    placeholder="Enter a valid URL"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full p-2 rounded-xl text-white bg-sky-500"
          >
            Submit
          </Button>
          <ToastContainer />
        </form>
      </Form>

      {/* Render submitted data */}

      <ul>
        {submittedData.map((item, index) => (
          <li key={index}>
            <Link href={item.url} target="_blank">
              {item.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormComponent;
