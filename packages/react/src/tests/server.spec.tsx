// @vitest-environment node
import type { ReactElement } from 'react'
import { renderToString } from 'react-dom/server'
import * as loica from '..'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Alert,
  AlertDescription,
  AlertDismiss,
  AlertTitle,
  Avatar,
  AvatarGroup,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Carousel,
  CarouselDots,
  CarouselNext,
  CarouselPrev,
  CarouselSlide,
  CarouselSlides,
  Checkbox,
  Chip,
  Code,
  Collapse,
  ConfirmProvider,
  Container,
  DatePicker,
  DescriptionDetails,
  DescriptionList,
  DescriptionTerm,
  Divider,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  EmptyState,
  Field,
  FieldHelperText,
  FieldLabel,
  FileUpload,
  Heading,
  Icon,
  Input,
  Kbd,
  Link,
  LinkProvider,
  List,
  ListDivider,
  ListItem,
  ListItemText,
  ListSubheader,
  Loader,
  LocaleProvider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarToggle,
  NumberInput,
  PageHeader,
  Paginator,
  PinInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ProgressBar,
  Radio,
  RadioGroup,
  Rating,
  Select,
  Sidebar,
  SidebarContent,
  SidebarItem,
  SidebarProvider,
  SidebarToggle,
  Skeleton,
  Slider,
  Stack,
  Stat,
  Step,
  StepIndicator,
  StepSeparator,
  StepTitle,
  Stepper,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  Text,
  Textarea,
  ThemeProvider,
  TimePicker,
  ToastProvider,
  Toggle,
  Tooltip,
  Tree,
  TreeItem,
  TreeItemGroup,
  TreeItemLabel,
  useConfirm,
  useToast,
} from '..'

type Entry = [label: string, element: () => ReactElement, covers?: string[]]

const options = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
]

function UsesConfirm(): ReactElement {
  useConfirm()
  return <span />
}

function UsesToast(): ReactElement {
  useToast()
  return <span />
}

const entries: Entry[] = [
  [
    'Accordion',
    () => (
      <Accordion defaultValue="a">
        <AccordionItem value="a">
          <AccordionTrigger>Question</AccordionTrigger>
          <AccordionContent>Answer</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  ],
  [
    'Alert',
    () => (
      <Alert status="warning">
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description</AlertDescription>
        <AlertDismiss />
      </Alert>
    ),
  ],
  ['Avatar', () => <Avatar name="Ana Perez" />],
  [
    'AvatarGroup',
    () => (
      <AvatarGroup max={1}>
        <Avatar name="Ana Perez" />
        <Avatar name="Luis Gomez" />
      </AvatarGroup>
    ),
  ],
  ['Badge', () => <Badge>New</Badge>],
  [
    'Breadcrumb',
    () => (
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem>
          <BreadcrumbLink current>Page</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    ),
  ],
  ['Button', () => <Button>Save</Button>],
  [
    'Card',
    () => (
      <Card>
        <CardHeader>Header</CardHeader>
        <CardBody>Body</CardBody>
        <CardFooter>Footer</CardFooter>
      </Card>
    ),
  ],
  [
    'Carousel',
    () => (
      <Carousel aria-label="Photos">
        <CarouselSlides>
          <CarouselSlide>One</CarouselSlide>
          <CarouselSlide>Two</CarouselSlide>
        </CarouselSlides>
        <CarouselPrev />
        <CarouselNext />
        <CarouselDots />
      </Carousel>
    ),
  ],
  ['Checkbox', () => <Checkbox aria-label="Accept" />],
  ['Chip', () => <Chip>Tag</Chip>],
  ['Code', () => <Code>pnpm add</Code>],
  ['Collapse', () => <Collapse open>Content</Collapse>],
  [
    'ConfirmProvider',
    () => (
      <ConfirmProvider>
        <UsesConfirm />
      </ConfirmProvider>
    ),
  ],
  ['Container', () => <Container>Content</Container>],
  ['DatePicker', () => <DatePicker onValueChange={() => undefined} />],
  [
    'DescriptionList',
    () => (
      <DescriptionList>
        <DescriptionTerm>Term</DescriptionTerm>
        <DescriptionDetails>Details</DescriptionDetails>
      </DescriptionList>
    ),
    ['Description'],
  ],
  ['Divider', () => <Divider />],
  [
    'Drawer',
    () => (
      <Drawer>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>Title</DrawerHeader>
          <DrawerBody>Body</DrawerBody>
          <DrawerFooter>Footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    ),
  ],
  [
    'Drawer, open',
    () => (
      <Drawer defaultOpen>
        <DrawerTrigger>Open</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>Title</DrawerHeader>
          <DrawerBody>Body</DrawerBody>
        </DrawerContent>
      </Drawer>
    ),
    [],
  ],
  [
    'Dropdown',
    () => (
      <Dropdown>
        <DropdownTrigger>
          <Button>Actions</Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownLabel>Account</DropdownLabel>
          <DropdownGroup>
            <DropdownItem>Profile</DropdownItem>
          </DropdownGroup>
          <DropdownSeparator />
          <DropdownItem>Sign out</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    ),
  ],
  [
    'Dropdown, open',
    () => (
      <Dropdown defaultOpen>
        <DropdownTrigger>
          <Button>Actions</Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem>Profile</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    ),
    [],
  ],
  ['EmptyState', () => <EmptyState title="Nothing here" />],
  [
    'Field',
    () => (
      <Field>
        <FieldLabel>Name</FieldLabel>
        <Input />
        <FieldHelperText>Help</FieldHelperText>
      </Field>
    ),
  ],
  ['FileUpload', () => <FileUpload aria-label="Files">Drop files</FileUpload>],
  ['Heading', () => <Heading>Title</Heading>],
  [
    'Icon',
    () => (
      <Icon aria-label="Star">
        <svg />
      </Icon>
    ),
  ],
  ['Input', () => <Input aria-label="Name" />],
  ['Kbd', () => <Kbd>Ctrl</Kbd>],
  ['Link', () => <Link href="/">Home</Link>],
  [
    'LinkProvider',
    () => (
      <LinkProvider component="a">
        <Link href="/">Home</Link>
      </LinkProvider>
    ),
  ],
  [
    'List',
    () => (
      <List>
        <ListSubheader>Group</ListSubheader>
        <ListItem>
          <ListItemText primary="Primary" secondary="Secondary" />
        </ListItem>
        <ListDivider />
      </List>
    ),
  ],
  ['Loader', () => <Loader />],
  [
    'LocaleProvider',
    () => (
      <LocaleProvider locale="es">
        <Paginator aria-label="Pages" total={50} />
      </LocaleProvider>
    ),
  ],
  [
    'Modal',
    () => (
      <Modal>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent>
          <ModalHeader>Title</ModalHeader>
          <ModalBody>Body</ModalBody>
          <ModalFooter>Footer</ModalFooter>
        </ModalContent>
      </Modal>
    ),
  ],
  [
    'Modal, open',
    () => (
      <Modal defaultOpen>
        <ModalTrigger>Open</ModalTrigger>
        <ModalContent>
          <ModalHeader>Title</ModalHeader>
          <ModalBody>Body</ModalBody>
        </ModalContent>
      </Modal>
    ),
    [],
  ],
  [
    'Navbar',
    () => (
      <Navbar aria-label="Main">
        <NavbarBrand href="/">Loica</NavbarBrand>
        <NavbarToggle />
        <NavbarContent>
          <NavbarItem active href="/">
            Home
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    ),
  ],
  ['NumberInput', () => <NumberInput aria-label="Amount" />],
  ['PageHeader', () => <PageHeader description="About" title="Title" />],
  ['Paginator', () => <Paginator aria-label="Pages" total={100} />],
  ['PinInput', () => <PinInput aria-label="Code" length={4} />],
  [
    'Popover',
    () => (
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>
    ),
  ],
  [
    'Popover, open',
    () => (
      <Popover defaultOpen>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>Body</PopoverContent>
      </Popover>
    ),
    [],
  ],
  ['ProgressBar', () => <ProgressBar aria-label="Load" showValue value={40} />],
  [
    'Radio',
    () => (
      <RadioGroup aria-label="Plan" defaultValue="a">
        <Radio aria-label="A" value="a" />
        <Radio aria-label="B" value="b" />
      </RadioGroup>
    ),
    ['Radio', 'RadioGroup'],
  ],
  ['Rating', () => <Rating aria-label="Score" defaultValue={3} />],
  ['Select', () => <Select aria-label="Number" defaultValue="one" options={options} />],
  [
    'Select, open',
    () => (
      <Select aria-label="Number" defaultOpen defaultValue={['one']} multiple options={options} />
    ),
    [],
  ],
  [
    'Sidebar',
    () => (
      <SidebarProvider>
        <SidebarToggle />
        <Sidebar aria-label="Main">
          <SidebarContent>
            <SidebarItem href="/">Home</SidebarItem>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    ),
    ['Sidebar', 'SidebarProvider'],
  ],
  ['Skeleton', () => <Skeleton />],
  ['Slider', () => <Slider aria-label="Volume" defaultValue={30} />],
  ['Stack', () => <Stack>Content</Stack>],
  ['Stat', () => <Stat change="+4%" label="Users" trend="up" value={1234} />],
  [
    'Stepper',
    () => (
      <Stepper activeStep={1} aria-label="Steps">
        <Step>
          <StepIndicator />
          <StepTitle>Account</StepTitle>
          <StepSeparator />
        </Step>
        <Step>
          <StepIndicator />
          <StepTitle>Profile</StepTitle>
        </Step>
      </Stepper>
    ),
    ['Stepper', 'Step'],
  ],
  [
    'Tabs',
    () => (
      <Tabs>
        <TabList>
          <Tab label="One" />
          <Tab label="Two" />
        </TabList>
        <TabPanels>
          <TabPanel>First</TabPanel>
          <TabPanel>Second</TabPanel>
        </TabPanels>
      </Tabs>
    ),
    ['Tabs', 'Tab'],
  ],
  [
    'Table',
    () => (
      <Table aria-label="People">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Ana</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  ],
  ['Text', () => <Text>Words</Text>],
  ['Textarea', () => <Textarea aria-label="Bio" showCount />],
  ['ThemeProvider', () => <ThemeProvider>Content</ThemeProvider>],
  ['TimePicker', () => <TimePicker />],
  [
    'ToastProvider',
    () => (
      <ToastProvider>
        <UsesToast />
      </ToastProvider>
    ),
    ['Toast'],
  ],
  ['Toggle', () => <Toggle aria-label="On" />],
  [
    'Tooltip',
    () => (
      <Tooltip content="Help">
        <Button>Hover</Button>
      </Tooltip>
    ),
  ],
  [
    'Tree',
    () => (
      <Tree aria-label="Files" defaultExpanded={['src']}>
        <TreeItem value="src">
          <TreeItemLabel>src</TreeItemLabel>
          <TreeItemGroup>
            <TreeItem value="index">
              <TreeItemLabel>index.ts</TreeItemLabel>
            </TreeItem>
          </TreeItemGroup>
        </TreeItem>
      </Tree>
    ),
  ],
]

// The toasts are drawn from the client, once `toast()` is called, so the provider is the only part of them that
// renders on the server.
const roots = entries.flatMap(([label, , covers]) => covers ?? [label])
const isComponent = (name: string): boolean => /^[A-Z]/.test(name)

describe('every component on the server', () => {
  it.each(entries)('%s renders without a browser', (_label, element) => {
    expect(() => renderToString(element())).not.toThrow()
  })

  it.each(entries)('%s renders inside a ThemeProvider', (_label, element) => {
    expect(() => renderToString(<ThemeProvider>{element()}</ThemeProvider>)).not.toThrow()
  })

  it('has a case for every component the package exports, so a new one has to be added here', () => {
    const missing = Object.keys(loica)
      .filter(isComponent)
      .filter((name) => !roots.some((root) => name.startsWith(root)))
    expect(missing).toEqual([])
  })
})
