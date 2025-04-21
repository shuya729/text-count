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
                <Link to="/about">
                  <Button variant="ghost" className="text-foreground">
                    ツールについて
                  </Button>
                </Link>

                <Link to="/term">
                  <Button variant="ghost" className="text-foreground">
                    利用規約
                  </Button>
                </Link>

                <Link to="/privacy">
                  <Button variant="ghost" className="text-foreground">
                    プライバシー
                  </Button>
                </Link>

                <Link to="/contact">
                  <Button variant="ghost" className="text-foreground">
                    問い合わせ
                  </Button>
                </Link>
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
                <Link to="/about">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenMenu(false)}
                    className="text-foreground"
                  >
                    ツールについて
                  </Button>
                </Link>

                <Link to="/term">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenMenu(false)}
                    className="text-foreground"
                  >
                    利用規約
                  </Button>
                </Link>

                <Link to="/privacy">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenMenu(false)}
                    className="text-foreground"
                  >
                    プライバシー
                  </Button>
                </Link>

                <Link to="/contact">
                  <Button
                    variant="ghost"
                    onClick={() => setOpenMenu(false)}
                    className="text-foreground"
                  >
                    問い合わせ
                  </Button>
                </Link>
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
