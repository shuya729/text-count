import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { Menu } from "lucide-react";
import { type JSX, useState } from "react";
import { Link, Outlet } from "react-router";

const PageList = [
  { to: '/about', label: 'ツールについて' },
  { to: '/term', label: '利用規約' },
  { to: '/privacy', label: 'プライバシー' },
  { to: '/contact', label: '問い合わせ' },
]

export const Layout = (): JSX.Element => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <>
      <div className="w-full min-w-[370px]">
        <header className="flex w-full h-fit justify-between items-center p-2 sm:p-5">
          <div className="flex items-end">
            <Link to="/">
              <Button
                variant="ghost"
                className="font-m-plus-rounded text-lg font-medium text-foreground"
              >
                AI文字数調整くん
              </Button>
            </Link>

            <div className="h-fit hidden sm:block">
              <div className="flex justify-between h-fit">
                {PageList.map((page) => (
                  <Link key={"list-" + page.to} to={page.to}>
                    <Button variant="ghost" className="text-foreground">
                      {page.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            className="w-fit h-fit block sm:hidden"
            onClick={() => setOpenMenu(true)}
          >
            <Menu />
          </Button>

          <Sheet open={openMenu} onOpenChange={(open) => setOpenMenu(open)}>
            <SheetContent side="top" className="h-fit gap-0">
              <SheetHeader className="pb-0">
                <SheetTitle>
                  <Link to="/">
                    <Button
                      variant="ghost"
                      onClick={() => setOpenMenu(false)}
                      className="text-foreground font-bold"
                    >
                      ホーム
                    </Button>
                  </Link>
                </SheetTitle>
                <SheetDescription />
              </SheetHeader>

              <div className="flex flex-col items-start pl-4">
                {PageList.map((page) => (
                  <Link key={"sheet-" + page.to} to={page.to}>
                    <Button
                      variant="ghost"
                      onClick={() => setOpenMenu(false)}
                      className="text-foreground w-full text-left"
                    >
                      {page.label}
                    </Button>
                  </Link>
                ))}
              </div>
              <SheetFooter />
            </SheetContent>
          </Sheet>
        </header>

        <Outlet />

        <footer />
      </div>

      <Toaster />
    </>
  );
};
