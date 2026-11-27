import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Button,
  ColorPicker,
  DatePicker,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  Field,
  FileUpload,
  Input,
  NumberInput,
  SegmentedControl,
  Select,
  SelectChevron,
  SelectChips,
  SelectCombobox,
  SelectContent,
  SelectField,
  SelectHidden,
  SelectOption,
  SelectTrigger,
  Slider,
  Textarea,
  numberFormat,
  useToast,
  type DateRange,
} from "@loica-ui/react";
import {
  createProject,
  members,
  type NewProjectInput,
  type Project,
  type Visibility,
} from "../lib/data";
import { toIsoDate } from "../lib/format";
import {
  dueRules,
  nameRules,
  ownerRules,
  teamRules,
  useErrorText,
} from "../lib/validation";
import styles from "./projects.module.css";

const projectColors = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];

const priorities = [1, 2, 3, 4, 5];

const maxAttachmentSize = 5 * 1024 * 1024;

const empty: NewProjectInput = {
  budget: null,
  color: "",
  description: "",
  due: "",
  name: "",
  notify: false,
  owner: "",
  priority: 3,
  team: [],
  visibility: "Workspace",
};

const attachmentKey = (file: File): string => `${file.name}-${file.size}`;

function ProjectAttachments(): ReactNode {
  const { i18n, t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const uploading = files.some((file) => (progress[attachmentKey(file)] ?? 0) < 100);

  useEffect(() => {
    if (!uploading) return;
    const timer = setInterval(() => {
      setProgress((current) => {
        const next = { ...current };
        for (const file of files) {
          const key = attachmentKey(file);
          next[key] = Math.min(100, (next[key] ?? 0) + 10 + Math.random() * 15);
        }
        return next;
      });
    }, 400);
    return () => clearInterval(timer);
  }, [files, uploading]);

  return (
    <Field
      helperText={t("newProject.attachmentsHelper")}
      label={t("newProject.attachmentsLabel")}
      optionalText={t("newProject.descriptionOptional")}
    >
      <FileUpload
        accept=".pdf,.png,.jpg,.docx"
        locale={i18n.language}
        maxFiles={3}
        maxSize={maxAttachmentSize}
        multiple
        onValueChange={setFiles}
        progress={(file) => progress[attachmentKey(file)] ?? 0}
        value={files}
      />
    </Field>
  );
}

export function NewProjectDrawer({
  onCreated,
  onOpenChange,
  open,
  takenNames,
}: Readonly<{
  onCreated: (project: Project) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  takenNames: string[];
}>): ReactNode {
  const { i18n, t } = useTranslation();
  const errorText = useErrorText();
  const toast = useToast();
  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<NewProjectInput>({ defaultValues: empty });

  // Resetting once the drawer is closed, after a submit has finished, keeps the next opening untouched.
  useEffect(() => {
    if (!open) reset(empty);
  }, [open, reset]);

  const changeOpen = (next: boolean): void => {
    if (isSubmitting) return;
    onOpenChange(next);
  };

  const submit = async (values: NewProjectInput): Promise<void> => {
    try {
      const project = await createProject({
        ...values,
        name: values.name.trim(),
      });
      onCreated(project);
      onOpenChange(false);
    } catch (error) {
      console.error("Could not create the project.", error);
      toast.error({ title: t("newProject.createError") });
    }
  };

  return (
    <Drawer onOpenChange={changeOpen} open={open}>
      <DrawerContent>
        <DrawerHeader>{t("newProject.title")}</DrawerHeader>
        <form
          className={styles.drawerForm}
          noValidate
          onSubmit={(event) => {
            void handleSubmit(submit)(event);
          }}
        >
          <DrawerBody>
            <div className="d-flex flex-column gap-3 py-2">
              <Field
                errorText={errorText(errors.name)}
                label={t("newProject.nameLabel")}
                required
              >
                <Input
                  placeholder={t("newProject.namePlaceholder")}
                  {...register("name", nameRules(takenNames))}
                />
              </Field>
              <Field
                helperText={t("newProject.descriptionHelper")}
                label={t("newProject.descriptionLabel")}
                optionalText={t("newProject.descriptionOptional")}
              >
                <Textarea
                  maxLength={160}
                  rows={3}
                  {...register("description")}
                />
              </Field>
              <Controller
                control={control}
                name="color"
                render={({ field }) => (
                  <Field
                    helperText={t("newProject.colorHelper")}
                    label={t("newProject.colorLabel")}
                    optionalText={t("newProject.descriptionOptional")}
                  >
                    <ColorPicker
                      name={field.name}
                      onValueChange={field.onChange}
                      placeholder={t("newProject.colorPlaceholder")}
                      ref={field.ref}
                      swatches={projectColors}
                      value={field.value}
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="owner"
                render={({ field, fieldState }) => (
                  <Field
                    errorText={errorText(fieldState.error)}
                    label={t("newProject.ownerLabel")}
                    required
                  >
                    <Select
                      name={field.name}
                      onValueChange={(value) => field.onChange(String(value))}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectField>
                          <SelectCombobox
                            placeholder={t("newProject.ownerPlaceholder")}
                            ref={field.ref}
                          />
                        </SelectField>
                        <SelectChevron />
                        <SelectHidden />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectOption key={member} value={member}>
                            {member}
                          </SelectOption>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                rules={ownerRules}
              />
              <Controller
                control={control}
                name="team"
                render={({ field, fieldState }) => (
                  <Field
                    errorText={errorText(fieldState.error)}
                    label={t("newProject.teamLabel")}
                    required
                  >
                    <Select
                      multiple
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(Array.isArray(value) ? value : [value])
                      }
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectField>
                          <SelectChips />
                          <SelectCombobox
                            placeholder={t("newProject.teamPlaceholder")}
                            ref={field.ref}
                          />
                        </SelectField>
                        <SelectChevron />
                        <SelectHidden />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((member) => (
                          <SelectOption key={member} value={member}>
                            {member}
                          </SelectOption>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                )}
                rules={teamRules}
              />
              <Controller
                control={control}
                name="due"
                render={({ field, fieldState }) => (
                  <Field
                    errorText={errorText(fieldState.error)}
                    label={t("newProject.dueLabel")}
                    required
                  >
                    <DatePicker
                      minDate={new Date()}
                      name={field.name}
                      onBlur={field.onBlur}
                      onValueChange={(range: DateRange) =>
                        field.onChange(
                          range.startDate ? toIsoDate(range.startDate) : "",
                        )
                      }
                      placeholder={t("newProject.duePlaceholder")}
                      ref={field.ref}
                      value={{
                        endDate: null,
                        startDate: field.value
                          ? new Date(`${field.value}T00:00:00`)
                          : null,
                      }}
                      weekStartsOn="locale"
                    />
                  </Field>
                )}
                rules={dueRules}
              />
              <Controller
                control={control}
                name="budget"
                render={({ field }) => (
                  <Field
                    helperText={t("newProject.budgetHelper")}
                    label={t("newProject.budgetLabel")}
                    optionalText={t("newProject.descriptionOptional")}
                  >
                    <NumberInput
                      {...numberFormat(i18n.language, {
                        currency: "USD",
                        maximumFractionDigits: 0,
                        style: "currency",
                      })}
                      min={0}
                      name={field.name}
                      onValueChange={field.onChange}
                      precision={0}
                      step={500}
                      value={field.value}
                    />
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Field
                    helperText={t("newProject.priorityHelper")}
                    label={t("newProject.priorityLabel")}
                  >
                    <Slider
                      formatValue={(value) =>
                        t("newProject.priorityValue", { value })
                      }
                      marks={priorities.map((value) => ({
                        label: String(value),
                        value,
                      }))}
                      max={5}
                      min={1}
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(Array.isArray(value) ? value[0] : value)
                      }
                      value={field.value}
                    />
                  </Field>
                )}
              />
              <ProjectAttachments />
              <Controller
                control={control}
                name="visibility"
                render={({ field }) => (
                  <Field label={t("newProject.visibilityLabel")}>
                    <SegmentedControl
                      name={field.name}
                      onValueChange={(value) =>
                        field.onChange(value as Visibility)
                      }
                      options={[
                        { label: t("visibility.Workspace"), value: "Workspace" },
                        { label: t("visibility.Private"), value: "Private" },
                      ]}
                      value={field.value}
                    />
                  </Field>
                )}
              />
            </div>
          </DrawerBody>
          <DrawerFooter>
            <Button
              disabled={isSubmitting}
              onClick={() => changeOpen(false)}
              variant="ghost"
            >
              {t("newProject.cancel")}
            </Button>
            <Button loading={isSubmitting} loadingText="…" type="submit">
              {t("newProject.submit")}
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
