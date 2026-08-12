"use client";

import { showToast } from "@/lib/utils";
import { DomainSelectType } from "@focus-me/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { createDomainAction, updateDomainAction } from "../actions/actions";
import { domainSchema, DomainSchemaType } from "../actions/schemas";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDomainStatus } from "../lib/formatters";
import { domainStatuses } from "@focus-me/db";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

export const DomainForm = ({
  existingDomain,
  afterAction,
}: {
  existingDomain?: DomainSelectType;
  afterAction?: () => void;
}) => {
  const router = useRouter();
  const form = useForm<DomainSchemaType>({
    resolver: zodResolver(domainSchema),
    defaultValues: {
      domain: "",
      selfNote: "",
      subjectNote: "",
      status: "blocked",
    },
  });

  const handleSubmission = async (data: DomainSchemaType) => {
    const action = existingDomain
      ? updateDomainAction(existingDomain.id, data)
      : createDomainAction(data);
    const response = await action;
    if (response.error) {
      showToast("error", response.message);
    } else {
      showToast("success", response.message);
      router.refresh();
      form.reset();
      afterAction?.();
    }
  };

  return (
    <form
      onSubmit={form.handleSubmit(handleSubmission)}
      className="w-full flex flex-col gap-4"
    >
      <Controller
        control={form.control}
        name="domain"
        render={({ field, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor={fieldState.error && "invalid-domain-input"}>
              Domain
            </FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon>
                  <InputGroupText>https://</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id={fieldState.error && "invalid-domain-input"}
                  aria-invalid={!!fieldState.error}
                  placeholder="Enter a domain or url"
                  {...field}
                />
              </InputGroup>
            </FieldContent>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="status"
        render={({ field: { value, onChange, ...props }, fieldState }) => {
          const { label, icon: Icon } = formatDomainStatus(value);

          return (
            <Field data-invalid={!!fieldState.error}>
              <FieldLabel>Status</FieldLabel>
              <FieldContent>
                <Select value={value} onValueChange={onChange} {...props}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a status">
                      <div className="flex items-center gap-2">
                        <Icon className="size-4" />
                        <span>{label}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {domainStatuses.map((status) => {
                      const { label, icon: Icon } = formatDomainStatus(status);

                      return (
                        <SelectItem key={status} value={status}>
                          <div className="flex items-center gap-2">
                            <Icon className="size-4" />
                            <span>{label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          );
        }}
      />
      <Controller
        control={form.control}
        name="selfNote"
        render={({ field: { value, ...props }, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel htmlFor={fieldState.error && "invalid-self-note-input"}>
              Self Note
            </FieldLabel>
            <FieldContent>
              <Textarea
                id={fieldState.error && "invalid-self-note-input"}
                aria-invalid={!!fieldState.error}
                placeholder="This website was blocked because he was spending too much time on it."
                value={value ?? ""}
                {...props}
              />
            </FieldContent>
            <FieldDescription>
              An optional note for yourself about this domain and the reason
              behind the status.
            </FieldDescription>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        control={form.control}
        name="subjectNote"
        render={({ field: { value, ...props }, fieldState }) => (
          <Field data-invalid={!!fieldState.error}>
            <FieldLabel
              htmlFor={fieldState.error && "invalid-subject-note-input"}
            >
              Subject Note
            </FieldLabel>
            <FieldContent>
              <Textarea
                id={fieldState.error && "invalid-subject-note-input"}
                aria-invalid={!!fieldState.error}
                placeholder="You cannot visit this website because you need to study."
                value={value ?? ""}
                {...props}
              />
            </FieldContent>
            <FieldDescription>
              An optional note for the subject (you, someone else, etc.) of the
              extension.
            </FieldDescription>
            {fieldState.error && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button
        type="submit"
        className="w-full"
        disabled={form.formState.isSubmitting}
      >
        <LoadingSwap isLoading={form.formState.isSubmitting}>
          {existingDomain ? "Save changes" : "Create"}
        </LoadingSwap>
      </Button>
    </form>
  );
};
